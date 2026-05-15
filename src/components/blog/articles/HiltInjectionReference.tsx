import {
  H2,
  P,
  InlineCode,
  CodeBlock,
  UL,
  LI,
  Callout,
  Table,
} from "@/components/blog/Prose";

export default function HiltInjectionReference() {
  return (
    <>
      <P>
        Hilt exposes its dependency graph through four core annotations,
        each fitting a specific situation. This article is a quick lookup
        for when you&apos;ve forgotten which one applies — pull it up when
        you&apos;re not sure whether you need <InlineCode>@EntryPoint</InlineCode>
        {" "}or <InlineCode>@AssistedInject</InlineCode>, or when you want to
        recall what <InlineCode>@AndroidEntryPoint</InlineCode> actually does
        under the hood. It assumes you already know basic dependency
        injection.
      </P>

      <H2>Decision matrix</H2>

      <Table
        headers={["Scenario", "Use this"]}
        rows={[
          ["Plain class you own", "@Inject constructor"],
          [
            "Activity / Fragment / Service / View",
            "@AndroidEntryPoint",
          ],
          ["ViewModel", "@HiltViewModel (wraps @AssistedInject)"],
          ["Worker", "@HiltWorker (wraps @AssistedInject)"],
          ["ContentProvider", "@EntryPoint"],
          ["Third-party SDK callback", "@EntryPoint"],
          [
            "Class with runtime args",
            "@AssistedInject + @AssistedFactory",
          ],
        ]}
      />

      <H2>Quick context: the Hilt graph</H2>

      <P>
        The Hilt graph is a compile-time DAG of bindings. Each binding
        describes how to construct one type, and each type can appear in
        the graph through one of four mechanisms:
      </P>

      <UL>
        <LI>
          <InlineCode>@Inject</InlineCode> constructor — your own class.
        </LI>
        <LI>
          <InlineCode>@Provides</InlineCode> — a module method that returns
          an instance, used for third-party types you can&apos;t annotate.
        </LI>
        <LI>
          <InlineCode>@Binds</InlineCode> — declares an interface →
          implementation mapping.
        </LI>
        <LI>
          <InlineCode>@Multibinds</InlineCode> — declares a{" "}
          <InlineCode>Map</InlineCode> or <InlineCode>Set</InlineCode>{" "}
          binding that multiple modules can contribute to.
        </LI>
      </UL>

      <P>
        The graph is partitioned across a hierarchy of components, each
        with its own lifetime:
      </P>

      <CodeBlock>{`SingletonComponent              (process-wide, @Singleton)
        ↓
ActivityRetainedComponent      (survives config change)
        ↓
ActivityComponent              (per-Activity, @ActivityScoped)
        ↓
FragmentComponent              (per-Fragment, @FragmentScoped)
        ↓
ViewComponent                  (per-View)`}</CodeBlock>

      <P>
        Each annotation below targets a specific shape of access into this
        graph.
      </P>

      <H2><InlineCode>@Inject</InlineCode> constructor</H2>

      <P>
        <strong>When</strong>: a plain class you own.
      </P>

      <CodeBlock language="kotlin">{`class TopicsRepository @Inject constructor(
    private val networkDataSource: NiaNetworkDataSource,
    private val topicDao: TopicDao,
) {
    suspend fun getTopics(): List<Topic> = ...
}`}</CodeBlock>

      <P>
        Hilt picks this up automatically. No module needed unless the
        class implements an interface (use <InlineCode>@Binds</InlineCode>)
        or is a third-party type you can&apos;t annotate (use{" "}
        <InlineCode>@Provides</InlineCode>).
      </P>

      <H2><InlineCode>@AndroidEntryPoint</InlineCode></H2>

      <P>
        <strong>When</strong>: Android framework classes —{" "}
        <InlineCode>Activity</InlineCode>, <InlineCode>Fragment</InlineCode>,{" "}
        <InlineCode>Service</InlineCode>,{" "}
        <InlineCode>BroadcastReceiver</InlineCode>, or{" "}
        <InlineCode>View</InlineCode>.
      </P>

      <CodeBlock language="kotlin">{`@AndroidEntryPoint
class HomeActivity : AppCompatActivity() {
    @Inject lateinit var analytics: AnalyticsHelper

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        analytics.logScreenView("home")   // already injected
    }
}`}</CodeBlock>

      <P>
        <strong>How it works</strong>: the Hilt Gradle plugin rewrites
        bytecode so your class&apos;s parent becomes a generated{" "}
        <InlineCode>Hilt_HomeActivity</InlineCode>. That parent overrides{" "}
        <InlineCode>onCreate()</InlineCode> to call{" "}
        <InlineCode>inject()</InlineCode> <em>before</em>{" "}
        <InlineCode>super.onCreate()</InlineCode>, populating every{" "}
        <InlineCode>@Inject</InlineCode> field through Hilt&apos;s{" "}
        <InlineCode>ActivityComponent</InlineCode>.
      </P>

      <H2><InlineCode>@EntryPoint</InlineCode></H2>

      <P>
        <strong>When</strong>: classes Hilt can&apos;t manage directly.
        Common cases: <InlineCode>ContentProvider</InlineCode> (created
        before <InlineCode>Application.onCreate()</InlineCode>), third-party
        SDK callbacks, services in another process, or workers built by
        WorkManager reflection.
      </P>

      <CodeBlock language="kotlin">{`class MyContentProvider : ContentProvider() {

    @EntryPoint
    @InstallIn(SingletonComponent::class)
    interface ProviderEntryPoint {
        fun database(): MyDatabase
    }

    override fun query(uri: Uri, ...): Cursor? {
        val db = EntryPointAccessors
            .fromApplication<ProviderEntryPoint>(context!!)
            .database()
        return db.someDao().query(...)
    }
}`}</CodeBlock>

      <Callout type="warning">
        <strong>Scope rule</strong>: an{" "}
        <InlineCode>@EntryPoint</InlineCode> can only see bindings from
        the component it&apos;s installed in (and its ancestors). A
        SingletonComponent EntryPoint cannot reach an{" "}
        <InlineCode>@ActivityScoped</InlineCode> binding — use{" "}
        <InlineCode>fromActivity()</InlineCode>,{" "}
        <InlineCode>fromFragment()</InlineCode>, etc. for those scopes.
      </Callout>

      <P>
        <InlineCode>@EntryPoint</InlineCode> does <strong>not</strong>{" "}
        add bindings to the graph; it only exposes existing ones. Think
        of it as a read-only window into the graph.
      </P>

      <H2><InlineCode>@AssistedInject</InlineCode> + <InlineCode>@AssistedFactory</InlineCode></H2>

      <P>
        <strong>When</strong>: the class needs both DI-provided
        dependencies <em>and</em> runtime-provided parameters — a
        navigation argument, a <InlineCode>WorkerParameters</InlineCode>,
        a user-typed query. Runtime values can&apos;t live in the graph
        because they don&apos;t exist until the moment the class is
        constructed.
      </P>

      <CodeBlock language="kotlin">{`@HiltViewModel(assistedFactory = TopicViewModel.Factory::class)
class TopicViewModel @AssistedInject constructor(
    private val userDataRepository: UserDataRepository,
    topicsRepository: TopicsRepository,
    userNewsResourceRepository: UserNewsResourceRepository,
    @Assisted val topicId: String,           // ← runtime arg
) : ViewModel() {

    // ... StateFlows, methods ...

    @AssistedFactory
    interface Factory {
        fun create(topicId: String): TopicViewModel
    }
}`}</CodeBlock>

      <P>
        Mark caller-provided params with <InlineCode>@Assisted</InlineCode>.
        Declare an <InlineCode>@AssistedFactory</InlineCode> interface
        whose method signature matches the runtime params only — Hilt
        generates the factory implementation that combines graph-provided
        deps with caller-provided args.
      </P>

      <H2>Convenience wrappers: <InlineCode>@HiltViewModel</InlineCode> and <InlineCode>@HiltWorker</InlineCode></H2>

      <P>
        Both annotations wrap <InlineCode>@AssistedInject</InlineCode>{" "}
        for specific framework integrations, so the bookkeeping is
        handled for you:
      </P>

      <UL>
        <LI>
          <InlineCode>@HiltViewModel</InlineCode> registers the
          AssistedFactory in a multibinding map that{" "}
          <InlineCode>ViewModelProvider</InlineCode> reads from. The{" "}
          <InlineCode>assistedFactory</InlineCode> parameter (Hilt 2.49+)
          enables clean combination with{" "}
          <InlineCode>@AssistedInject</InlineCode> for navigation
          arguments, as in the example above.
        </LI>
        <LI>
          <InlineCode>@HiltWorker</InlineCode> registers the AssistedFactory
          in <InlineCode>HiltWorkerFactory</InlineCode>&apos;s multibinding
          so WorkManager can look up the right factory by Worker class
          name at runtime.
        </LI>
      </UL>

      <P>
        You usually don&apos;t write the{" "}
        <InlineCode>@AssistedFactory</InlineCode> interface manually when
        using these — the wrapper handles the registration plumbing.
      </P>

      <H2>All four meeting in the wild</H2>

      <P>
        A typical Android screen exercises all four annotations. An{" "}
        <InlineCode>@AndroidEntryPoint</InlineCode> Activity hosts a{" "}
        <InlineCode>@HiltViewModel</InlineCode> ViewModel that takes a
        navigation argument via <InlineCode>@AssistedInject</InlineCode>{" "}
        and depends on <InlineCode>@Inject</InlineCode>-constructed
        repositories. Background sync uses{" "}
        <InlineCode>@EntryPoint</InlineCode> to bridge from outside
        Hilt&apos;s lifecycle into the same graph. Now in Android&apos;s
        WorkManager pipeline is a textbook example: a plain{" "}
        <InlineCode>DelegatingWorker</InlineCode> (built by WorkManager
        reflection) pulls <InlineCode>HiltWorkerFactory</InlineCode> via{" "}
        <InlineCode>@EntryPoint</InlineCode>, which then uses the{" "}
        <InlineCode>@HiltWorker</InlineCode>-generated factory to
        construct <InlineCode>SyncWorker</InlineCode> with mixed DI +
        runtime parameters.
      </P>

      <P>
        One graph, four annotations, each solving a different problem.
      </P>
    </>
  );
}
