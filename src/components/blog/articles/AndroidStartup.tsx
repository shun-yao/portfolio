import {
  H2,
  P,
  InlineCode,
  CodeBlock,
  UL,
  OL,
  LI,
  Callout,
  Table,
} from "@/components/blog/Prose";

export default function AndroidStartup() {
  return (
    <>
      <P>
        Most Android developers know the four classic components —{" "}
        <InlineCode>Activity</InlineCode>, <InlineCode>Service</InlineCode>,{" "}
        <InlineCode>BroadcastReceiver</InlineCode>, and{" "}
        <InlineCode>ContentProvider</InlineCode>. They tend to think of{" "}
        <InlineCode>ContentProvider</InlineCode> as &quot;the one for sharing
        data between apps&quot; and move on. But it has a second, quieter
        property that has shaped the Android library ecosystem for years:
      </P>

      <Callout type="tip">
        <strong>
          ContentProviders are instantiated before{" "}
          <InlineCode>Application.onCreate()</InlineCode>.
        </strong>{" "}
        Specifically, every <InlineCode>ContentProvider</InlineCode> declared
        in your manifest has its <InlineCode>onCreate()</InlineCode> called
        during <InlineCode>ActivityThread</InlineCode>&apos;s app bind step,
        before your <InlineCode>Application</InlineCode>&apos;s
        <InlineCode>onCreate()</InlineCode> runs.
      </Callout>

      <P>
        This makes <InlineCode>ContentProvider</InlineCode> the earliest
        process-level hook accessible to library code. If you want to run
        code &quot;as soon as the app process exists,&quot; before any
        Activity has been created, without forcing every consumer of your
        library to add a line to their <InlineCode>Application</InlineCode>{" "}
        class — a stub <InlineCode>ContentProvider</InlineCode> is the trick.
      </P>

      <H2>Libraries discovered this trick — and abused it</H2>

      <P>
        Once one library showed the way, everyone followed. Firebase, the
        Facebook SDK, Crashlytics, AndroidX components — each declared its
        own zero-content <InlineCode>ContentProvider</InlineCode> in its
        manifest, purely as a hook to call{" "}
        <InlineCode>SDK.initialize()</InlineCode> before the rest of the app
        woke up. From the manifest&apos;s point of view, your app suddenly
        had eight or ten providers it never asked for. From the user&apos;s
        point of view, cold starts got slower with every dependency added.
      </P>

      <P>
        Each of those provider instantiations is not free. Android has to
        load the class, allocate the instance, plumb it into the Binder
        system, and call <InlineCode>onCreate()</InlineCode> — sequentially,
        before your app can show its first frame.
      </P>

      <Callout type="note">
        Google&apos;s post introducing the Jetpack Startup library cited
        real Play Store apps where{" "}
        <strong>hundreds of milliseconds of cold start time</strong> were
        being spent on bookkeeping for these stub providers. None of that
        time was doing anything useful for the user.
      </Callout>

      <H2>The fix: share one ContentProvider</H2>

      <P>
        The insight behind <InlineCode>androidx.startup</InlineCode>{" "}
        (released in 2020) is structural, not technical: if every library
        needs the same lifecycle hook, they can share a single{" "}
        <InlineCode>ContentProvider</InlineCode>. The Startup library
        contributes that single provider — called{" "}
        <InlineCode>InitializationProvider</InlineCode> — and defines a tiny
        contract that libraries implement instead of writing their own
        provider:
      </P>

      <CodeBlock language="kotlin">{`interface Initializer<T> {
    fun create(context: Context): T
    fun dependencies(): List<Class<out Initializer<*>>>
}`}</CodeBlock>

      <P>
        A library writes one class that implements this interface, then
        declares the class as <InlineCode>&lt;meta-data&gt;</InlineCode> on
        the shared provider. No more stub providers. One process-level hook,
        many initializers running through it.
      </P>

      <H2>How a library registers itself</H2>

      <P>
        Let&apos;s walk through how WorkManager — a Jetpack library that
        absolutely needs to initialize at app startup — wires itself into
        this system. Inside the{" "}
        <InlineCode>androidx.work:work-runtime</InlineCode> artifact, the
        library&apos;s own manifest looks like this:
      </P>

      <CodeBlock language="xml">{`<application>
    <provider
        android:name="androidx.startup.InitializationProvider"
        android:authorities="\${applicationId}.androidx-startup"
        android:exported="false"
        tools:node="merge">
        <meta-data
            android:name="androidx.work.WorkManagerInitializer"
            android:value="androidx.startup" />
    </provider>
</application>`}</CodeBlock>

      <P>Three pieces matter here:</P>

      <UL>
        <LI>
          The library re-declares the <em>same</em>{" "}
          <InlineCode>InitializationProvider</InlineCode> the Startup library
          declared. Manifest Merger will combine these into a single provider
          in the final APK.
        </LI>
        <LI>
          A <InlineCode>&lt;meta-data&gt;</InlineCode> entry names a class —
          here, <InlineCode>WorkManagerInitializer</InlineCode> — tagged
          with the magic value <InlineCode>androidx.startup</InlineCode>.
        </LI>
        <LI>
          <InlineCode>tools:node=&quot;merge&quot;</InlineCode> tells the
          merger to combine this declaration with other declarations of the
          same provider rather than overwriting them.
        </LI>
      </UL>

      <H2>Manifest Merger does the assembly at build time</H2>

      <P>
        When AGP builds your app, manifests from every dependency are
        merged. Each library that opts in contributes one{" "}
        <InlineCode>&lt;meta-data&gt;</InlineCode> entry. After merging,
        your final manifest looks roughly like this:
      </P>

      <CodeBlock language="xml">{`<provider
    android:name="androidx.startup.InitializationProvider"
    android:authorities="\${applicationId}.androidx-startup"
    android:exported="false">
    <meta-data android:name="androidx.work.WorkManagerInitializer"
        android:value="androidx.startup" />
    <meta-data android:name="androidx.emoji2.text.EmojiCompatInitializer"
        android:value="androidx.startup" />
    <meta-data android:name="androidx.lifecycle.ProcessLifecycleInitializer"
        android:value="androidx.startup" />
    <meta-data android:name="androidx.profileinstaller.ProfileInstallerInitializer"
        android:value="androidx.startup" />
    <!-- ...and so on -->
</provider>`}</CodeBlock>

      <P>
        Every opted-in library&apos;s &quot;business card&quot; ends up
        inside the same provider. One provider, many initializers. That is
        the entire architectural trick.
      </P>

      <Callout type="tip">
        You can verify this yourself: after a build, open{" "}
        <InlineCode>
          app/build/intermediates/merged_manifests/&hellip;/AndroidManifest.xml
        </InlineCode>{" "}
        and search for <InlineCode>InitializationProvider</InlineCode>.
        You&apos;ll see every library that registered itself.
      </Callout>

      <H2>Runtime: one provider, reflective dispatch</H2>

      <P>
        At runtime, Android instantiates{" "}
        <InlineCode>InitializationProvider</InlineCode> exactly like any
        other <InlineCode>ContentProvider</InlineCode>. Its{" "}
        <InlineCode>onCreate()</InlineCode> kicks off the discovery flow:
      </P>

      <CodeBlock language="kotlin">{`override fun onCreate(): Boolean {
    val context = checkNotNull(context)
    AppInitializer.getInstance(context).discoverAndInitialize()
    return true
}`}</CodeBlock>

      <P>
        And <InlineCode>discoverAndInitialize()</InlineCode> performs the
        following:
      </P>

      <OL>
        <LI>
          Use <InlineCode>PackageManager</InlineCode> to read the
          provider&apos;s own ComponentInfo, including the merged{" "}
          <InlineCode>&lt;meta-data&gt;</InlineCode> bundle.
        </LI>
        <LI>
          Filter entries whose value equals{" "}
          <InlineCode>androidx.startup</InlineCode>. Each key is a fully
          qualified class name.
        </LI>
        <LI>
          For each name, call <InlineCode>Class.forName(name)</InlineCode>{" "}
          and use reflection to instantiate the{" "}
          <InlineCode>Initializer</InlineCode> via its no-arg constructor.
        </LI>
        <LI>
          Build a dependency graph by calling{" "}
          <InlineCode>dependencies()</InlineCode> on each initializer, then
          topologically sort.
        </LI>
        <LI>
          Walk the sorted list and call{" "}
          <InlineCode>create(context)</InlineCode> on each. Return values
          are cached so dependents read them without re-running
          initialization.
        </LI>
      </OL>

      <H2>The WorkManager example, end to end</H2>

      <P>
        Now that the general machine is clear, here is what happens
        specifically for WorkManager between launcher tap and first frame:
      </P>

      <OL>
        <LI>
          Android reads the merged manifest, finds the single{" "}
          <InlineCode>InitializationProvider</InlineCode>, and adds it to
          the list of providers to instantiate.
        </LI>
        <LI>
          Before <InlineCode>Application.onCreate()</InlineCode>, Android
          calls the provider&apos;s <InlineCode>onCreate()</InlineCode>,
          which triggers <InlineCode>discoverAndInitialize()</InlineCode>.
        </LI>
        <LI>
          The Startup library reflectively instantiates each registered
          initializer, including{" "}
          <InlineCode>WorkManagerInitializer</InlineCode>.
        </LI>
        <LI>
          <InlineCode>WorkManagerInitializer.create(context)</InlineCode>{" "}
          checks whether your <InlineCode>Application</InlineCode> implements{" "}
          <InlineCode>Configuration.Provider</InlineCode>. If yes, your
          custom configuration is used; if not, it falls back to{" "}
          <InlineCode>Configuration.Builder().build()</InlineCode>.
        </LI>
        <LI>
          The initializer calls{" "}
          <InlineCode>WorkManager.initialize(context, config)</InlineCode>,
          populating the internal{" "}
          <InlineCode>sDefaultInstance</InlineCode>.
        </LI>
        <LI>
          Now <InlineCode>Application.onCreate()</InlineCode> runs. Any
          later call to{" "}
          <InlineCode>WorkManager.getInstance(context)</InlineCode>{" "}
          returns the already-initialized singleton without doing any work.
        </LI>
      </OL>

      <Callout type="note">
        This is also why, in modern projects, you do not need the{" "}
        <InlineCode>tools:node=&quot;remove&quot;</InlineCode> trick that
        older tutorials show. WorkManager 2.6+ checks for{" "}
        <InlineCode>Configuration.Provider</InlineCode> inside the
        Startup-driven path itself. Disabling the provider was only needed
        back when <InlineCode>WorkManagerInitializer</InlineCode> blindly
        used the default config and ignored your custom one.
      </Callout>

      <H2>Dependencies and ordering</H2>

      <P>
        The <InlineCode>dependencies()</InlineCode> list is what makes the
        system composable. If a custom initializer needs WorkManager to be
        ready first, it can declare:
      </P>

      <CodeBlock language="kotlin">{`class MyInitializer : Initializer<MyComponent> {
    override fun create(context: Context): MyComponent {
        // WorkManager is guaranteed ready by the time this runs
        val workManager = WorkManager.getInstance(context)
        return MyComponent(workManager)
    }

    override fun dependencies() = listOf(
        WorkManagerInitializer::class.java,
    )
}`}</CodeBlock>

      <P>
        The Startup library handles cycles (they throw), missing
        initializers (they throw too), and ensures each initializer runs
        exactly once, even when multiple downstream initializers list it as
        a dependency.
      </P>

      <H2>Three eras of library initialization</H2>

      <Table
        headers={["Approach", "How it works", "Cost"]}
        rows={[
          [
            "Library-owned ContentProvider (pre-2020)",
            "Each library declares its own stub provider",
            "N providers instantiated at every cold start",
          ],
          [
            "androidx.startup (current)",
            "Single shared provider, libraries register via metadata",
            "1 provider, reflective dispatch, dependency-aware",
          ],
          [
            "Manual init in Application",
            "Developer calls Library.init() explicitly",
            "Transparent but tedious; easy to forget order",
          ],
        ]}
      />

      <H2>Takeaways</H2>

      <UL>
        <LI>
          <strong>
            ContentProvider&apos;s early lifecycle is a real Android primitive.
          </strong>{" "}
          The entire Startup library exists to manage one consequence of
          that lifecycle property. Knowing where{" "}
          <InlineCode>ContentProvider.onCreate()</InlineCode> sits relative
          to <InlineCode>Application.onCreate()</InlineCode> helps when
          you&apos;re debugging weird initialization-order bugs.
        </LI>
        <LI>
          <strong>Manifest merging is an extensibility point.</strong>{" "}
          Multiple libraries contributing entries to one shared{" "}
          <InlineCode>&lt;provider&gt;</InlineCode> node is how Startup
          scales without each library needing to know about the others.
        </LI>
        <LI>
          <strong>
            The pattern is a Service Provider Interface in disguise.
          </strong>{" "}
          If you have used Java&apos;s <InlineCode>ServiceLoader</InlineCode>{" "}
          or Dagger&apos;s multibindings, this should feel familiar — it is
          the same idea, expressed through Android manifest metadata instead
          of <InlineCode>META-INF/services</InlineCode>.
        </LI>
        <LI>
          <strong>You can opt out.</strong> Setting{" "}
          <InlineCode>tools:node=&quot;remove&quot;</InlineCode> on a
          specific <InlineCode>&lt;meta-data&gt;</InlineCode> excludes that
          initializer from your build. Useful when you want explicit control
          over a library&apos;s startup behavior.
        </LI>
      </UL>

      <P>
        The next time you read about a Jetpack library &quot;automatically
        configuring itself,&quot; you now know exactly what is happening: a
        merged manifest entry, a shared <InlineCode>ContentProvider</InlineCode>
        , and a reflective call to <InlineCode>create(context)</InlineCode>.
        No magic — just a good design choice that quietly removed hundreds
        of milliseconds from millions of cold starts.
      </P>
    </>
  );
}
