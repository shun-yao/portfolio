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
        Here is a question that almost every Android developer takes for
        granted: <strong>who initializes WorkManager?</strong> You never call{" "}
        <InlineCode>WorkManager.initialize()</InlineCode> yourself, yet by the
        time your <InlineCode>Application.onCreate()</InlineCode> finishes,
        WorkManager is ready, EmojiCompat has loaded its font, and
        ProcessLifecycleOwner is already observing your app&apos;s lifecycle.
        How?
      </P>
      <P>
        The answer is a small but elegant Jetpack library called{" "}
        <InlineCode>androidx.startup</InlineCode>. It solves a real problem —
        one that used to make cold starts painfully slow — and the way it works
        is a beautiful combination of Android&apos;s manifest merger, the
        ContentProvider lifecycle, and a tiny bit of reflection. Let&apos;s
        trace it end to end.
      </P>

      <H2>The problem: every library wanted to wake up first</H2>

      <P>
        Before <InlineCode>androidx.startup</InlineCode> existed (released in
        2020), library authors who needed to run code before your app&apos;s
        UI was visible had one common trick: declare a{" "}
        <InlineCode>ContentProvider</InlineCode> in the library&apos;s
        manifest. Android instantiates all declared{" "}
        <InlineCode>ContentProvider</InlineCode>s before your{" "}
        <InlineCode>Application.onCreate()</InlineCode> runs, so the library
        could piggyback on that to initialize itself.
      </P>

      <P>
        It worked. It also turned cold starts into a parade of unrelated
        ContentProviders. Firebase, Facebook SDK, Crashlytics, AndroidX
        components — each one a separate provider, each one allocated and
        initialized sequentially, every single time your app started. The
        cost was invisible to library authors but painfully visible to users.
      </P>

      <Callout type="note">
        Google&apos;s own blog post introducing the Startup library cited{" "}
        <strong>hundreds of milliseconds</strong> of cold start time spent on
        bookkeeping for these stub providers in real Play Store apps.
      </Callout>

      <H2>The fix: one shared ContentProvider</H2>

      <P>
        The Startup library&apos;s insight is simple: if everyone needs to
        run code at the same lifecycle point, they can share a single{" "}
        <InlineCode>ContentProvider</InlineCode>. Libraries register their
        initialization logic as <em>metadata</em> on a single provider — and
        that provider, called{" "}
        <InlineCode>InitializationProvider</InlineCode>, is contributed by
        the Startup library itself.
      </P>

      <P>
        The contract for libraries is the{" "}
        <InlineCode>Initializer&lt;T&gt;</InlineCode> interface:
      </P>

      <CodeBlock language="kotlin">{`interface Initializer<T> {
    fun create(context: Context): T
    fun dependencies(): List<Class<out Initializer<*>>>
}`}</CodeBlock>

      <P>
        A library implements this interface, declares the class as metadata
        in its manifest, and the Startup library picks it up at app launch.
        Two functions are all you need.
      </P>

      <H2>How a library registers itself</H2>

      <P>
        Let&apos;s look at how WorkManager actually does this. Inside the{" "}
        <InlineCode>androidx.work:work-runtime</InlineCode> artifact, the
        manifest contains:
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
          The library declares the <em>same</em>{" "}
          <InlineCode>InitializationProvider</InlineCode> that the Startup
          library declares. Manifest Merger will combine them into a single
          provider in the final APK.
        </LI>
        <LI>
          Inside that provider, a <InlineCode>&lt;meta-data&gt;</InlineCode>{" "}
          entry names a class — here,{" "}
          <InlineCode>WorkManagerInitializer</InlineCode> — and tags it with
          the magic value <InlineCode>androidx.startup</InlineCode>.
        </LI>
        <LI>
          <InlineCode>tools:node=&quot;merge&quot;</InlineCode> tells the
          Manifest Merger to combine this declaration with any other
          declarations of the same provider, rather than replacing them.
        </LI>
      </UL>

      <H2>Manifest Merger does the rest at build time</H2>

      <P>
        When AGP builds your app, it merges manifests from every dependency.
        Each library that wants Startup-based initialization contributes its
        own <InlineCode>&lt;meta-data&gt;</InlineCode> entry. After merging,
        your final manifest looks something like this:
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
        Every library&apos;s &quot;business card&quot; ends up inside one
        provider. One provider, many initializers. That is the entire
        architectural trick.
      </P>

      <Callout type="tip">
        You can verify this yourself: after a build, open{" "}
        <InlineCode>
          app/build/intermediates/merged_manifests/&hellip;/AndroidManifest.xml
        </InlineCode>{" "}
        and search for <InlineCode>InitializationProvider</InlineCode>.
        You&apos;ll see all the libraries that have registered themselves.
      </Callout>

      <H2>Runtime: discovery via reflection</H2>

      <P>
        At runtime, Android instantiates the{" "}
        <InlineCode>InitializationProvider</InlineCode> just like any other{" "}
        <InlineCode>ContentProvider</InlineCode>. Its{" "}
        <InlineCode>onCreate()</InlineCode> does essentially this:
      </P>

      <CodeBlock language="kotlin">{`override fun onCreate(): Boolean {
    val context = checkNotNull(context)
    AppInitializer.getInstance(context).discoverAndInitialize()
    return true
}`}</CodeBlock>

      <P>
        And <InlineCode>discoverAndInitialize()</InlineCode> performs the
        following steps:
      </P>

      <OL>
        <LI>
          Use <InlineCode>PackageManager</InlineCode> to read its own
          ComponentInfo, including the merged{" "}
          <InlineCode>&lt;meta-data&gt;</InlineCode> bundle.
        </LI>
        <LI>
          Filter entries whose value equals{" "}
          <InlineCode>androidx.startup</InlineCode>. The key of each entry is
          a fully qualified class name.
        </LI>
        <LI>
          For each class name, call{" "}
          <InlineCode>Class.forName(name)</InlineCode> and use reflection to
          instantiate the <InlineCode>Initializer</InlineCode> via its no-arg
          constructor.
        </LI>
        <LI>
          Compute the dependency graph by calling{" "}
          <InlineCode>dependencies()</InlineCode> on each initializer, then
          topologically sort them.
        </LI>
        <LI>
          For each initializer in sorted order, call{" "}
          <InlineCode>create(context)</InlineCode>. The return value is
          cached so dependents can read it without re-running initialization.
        </LI>
      </OL>

      <P>
        That is the whole runtime mechanism: read names from metadata,
        reflectively build a graph, walk it in order.
      </P>

      <H2>Dependencies and ordering</H2>

      <P>
        The <InlineCode>dependencies()</InlineCode> list is what makes the
        system composable. Suppose a custom initializer needs WorkManager to
        be ready first. It can declare:
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
        The Startup library handles cycles (they throw), missing initializers
        (they throw too), and ensures each initializer runs exactly once,
        even if multiple downstream initializers list it as a dependency.
      </P>

      <H2>The full picture: WorkManager at app launch</H2>

      <P>
        Putting it all together, here is what happens between the user
        tapping your launcher icon and the first frame:
      </P>

      <OL>
        <LI>
          Android loads the APK and reads the merged manifest, which contains
          a single <InlineCode>InitializationProvider</InlineCode>.
        </LI>
        <LI>
          Before <InlineCode>Application.onCreate()</InlineCode> runs, Android
          instantiates every declared <InlineCode>ContentProvider</InlineCode>{" "}
          — including the Startup one — and calls its{" "}
          <InlineCode>onCreate()</InlineCode>.
        </LI>
        <LI>
          The Startup provider reads its{" "}
          <InlineCode>&lt;meta-data&gt;</InlineCode>, finds{" "}
          <InlineCode>WorkManagerInitializer</InlineCode> among others, and
          reflectively instantiates it.
        </LI>
        <LI>
          <InlineCode>WorkManagerInitializer.create(context)</InlineCode>{" "}
          checks whether your <InlineCode>Application</InlineCode> implements{" "}
          <InlineCode>Configuration.Provider</InlineCode>. If yes, it uses
          your custom configuration; if not, it falls back to{" "}
          <InlineCode>Configuration.Builder().build()</InlineCode>.
        </LI>
        <LI>
          The initializer calls{" "}
          <InlineCode>WorkManager.initialize(context, config)</InlineCode>,
          which populates <InlineCode>sDefaultInstance</InlineCode>.
        </LI>
        <LI>
          Finally, <InlineCode>Application.onCreate()</InlineCode> runs. By
          this point, calling <InlineCode>WorkManager.getInstance(context)</InlineCode>{" "}
          returns the already-initialized singleton.
        </LI>
      </OL>

      <Callout type="note">
        This is also why, in modern projects, you do not need the{" "}
        <InlineCode>tools:node=&quot;remove&quot;</InlineCode> trick that
        older tutorials show. WorkManager 2.6+ checks for{" "}
        <InlineCode>Configuration.Provider</InlineCode> directly inside the
        Startup-driven path. Disabling the provider was only needed when{" "}
        <InlineCode>WorkManagerInitializer</InlineCode> blindly used the
        default config and ignored your custom one.
      </Callout>

      <H2>Comparison: three eras of library initialization</H2>

      <Table
        headers={["Approach", "How it works", "Cost"]}
        rows={[
          [
            "Library-owned ContentProvider",
            "Each library declares its own provider",
            "N providers instantiated at every cold start",
          ],
          [
            "androidx.startup",
            "Single provider, libraries register via metadata",
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
          <strong>Manifest merging is a real extensibility point.</strong>{" "}
          Multiple libraries contributing entries to one shared{" "}
          <InlineCode>&lt;provider&gt;</InlineCode> node is how the Startup
          library scales without coordination.
        </LI>
        <LI>
          <strong>
            ContentProviders run before <InlineCode>Application.onCreate()</InlineCode>.
          </strong>{" "}
          That is what makes them the universal Android trick for &quot;run
          code at app launch.&quot; Knowing this lifecycle ordering helps
          when you are debugging mysterious initialization issues.
        </LI>
        <LI>
          <strong>The pattern is essentially a Service Provider Interface.</strong>{" "}
          If you have used Java&apos;s <InlineCode>ServiceLoader</InlineCode>{" "}
          or Dagger&apos;s multibindings, this should feel familiar — it is
          the same idea, expressed through Android manifest metadata instead
          of <InlineCode>META-INF/services</InlineCode>.
        </LI>
        <LI>
          <strong>You can opt out.</strong> Setting{" "}
          <InlineCode>tools:node=&quot;remove&quot;</InlineCode> on a specific{" "}
          <InlineCode>&lt;meta-data&gt;</InlineCode> excludes that
          initializer from your build. Useful when you want explicit control
          over a library&apos;s startup behavior.
        </LI>
      </UL>

      <P>
        The next time you read about a Jetpack library &quot;automatically
        configuring itself,&quot; you now know exactly what that means: a
        merged manifest entry, a shared ContentProvider, and a reflective
        call to <InlineCode>create(context)</InlineCode>. No magic — just a
        good design choice that quietly removed hundreds of milliseconds
        from millions of cold starts.
      </P>
    </>
  );
}
