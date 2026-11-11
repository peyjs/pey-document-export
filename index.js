// Pey export plugin: entry point wiring prepare/activate.
import { MARKDOWN_SERVICE, SERVICE_NAME, createService } from './lib/export-service.js';

const state = { markdown: null };
// Per-prepare-call record: each call's hooks release ONLY that call's
// resources. A host may still invoke the hooks of a prepare context that a
// later prepare() superseded — those hooks must then leave the live call's
// listener and dependency reference alone.
let current = null;

/**
 * Reports a critical error when the required Markdown service disappears at
 * runtime. Settlement already handles startup-time absence automatically.
 * @param {object} event Core event envelope.
 * @returns {void}
 */
function handleServiceUnavailable(event) {
  if (event?.data?.serviceName !== MARKDOWN_SERVICE || !current?.context) {
    return;
  }
  current.context.reportCriticalError({
    code: 'REQUIRED_DEPENDENCY_LOST',
    message: `Required service ${MARKDOWN_SERVICE} is no longer available`,
    source: SERVICE_NAME,
    type: 'critical',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Releases one prepare() call's resources exactly once: its
 * core:service-unavailable listener leaves the Event Bus (a lost-dependency
 * event after release can never report a critical error for a dead plugin),
 * and — only when the released call is still the CURRENT one — the
 * dependency reference goes away too. A superseded call's hook finds
 * `current` pointing elsewhere and touches nothing of the live call.
 * @param {object} record The prepare call's own resource record.
 * @returns {void}
 */
function releaseCall(record) {
  if (record.released) {
    return;
  }
  record.released = true;
  if (record.unsubscribe !== null) {
    const unsubscribe = record.unsubscribe;
    record.unsubscribe = null;
    unsubscribe();
  }
  if (current === record) {
    current = null;
    state.markdown = null;
  }
}

/**
 * Prepares the plugin: builds the service and registers lifecycle hooks.
 * @param {object} prepareContext Bonyan preparation context.
 * @returns {Promise<Array>} Service registration.
 */
export async function prepare(prepareContext) {
  // A repeated prepare() call must not leave the previous call's listener
  // behind on the Event Bus: the previous record is released through its
  // own hook path, so a later invocation of that context's hooks no-ops.
  if (current !== null) {
    releaseCall(current);
  }
  const record = { context: prepareContext, unsubscribe: null, released: false };
  current = record;
  // The cleanup hooks are armed BEFORE any failible step: a prepare that
  // throws at any point still leaves the host a hook that releases this
  // call's resources.
  prepareContext.onDeactivated = () => releaseCall(record);
  prepareContext.onShutdown = async () => releaseCall(record);
  // The runtime dependency-loss safety net needs the Event Bus contract:
  // its absence is a broken host, so it fails loudly at startup instead of
  // silently arming nothing.
  const subscribe = prepareContext.events?.subscribe;
  if (typeof subscribe !== 'function') {
    releaseCall(record);
    current = null;
    throw Object.assign(new Error('Prepare context does not provide an Event Bus'), {
      code: 'EXPORT_EVENT_BUS_INVALID',
      source: SERVICE_NAME,
      type: 'startup',
      timestamp: new Date().toISOString(),
      detail: { reason: 'missing-event-bus' },
    });
  }
  let subscribed;
  try {
    subscribed = subscribe.call(prepareContext.events, 'core:service-unavailable', handleServiceUnavailable);
  } catch (error) {
    // Third contract-violation shape: subscribe itself throws mid-work. The
    // host may have registered the listener before the throw — disarm the
    // saved context so the orphaned handler is inert, and wrap the raw host
    // error into the same structured startup code as the other two shapes
    // (nothing raw crosses the boundary).
    releaseCall(record);
    current = null;
    throw Object.assign(new Error('The Event Bus subscribe failed mid-registration'), {
      code: 'EXPORT_EVENT_BUS_INVALID',
      source: SERVICE_NAME,
      type: 'startup',
      timestamp: new Date().toISOString(),
      detail: { reason: 'subscribe-threw', cause: error?.message ?? String(error) },
    });
  }
  if (typeof subscribed !== 'function') {
    // The host broke its own contract AFTER the listener was registered:
    // no unsubscribe handle exists to remove it. Disarming the saved
    // context makes the orphaned listener inert — the handler dismisses
    // immediately without a saved context, so the dead plugin can never
    // report a critical dependency loss (the residual listener itself is
    // documented in the reference's startup-errors section).
    releaseCall(record);
    current = null;
    throw Object.assign(new Error('The Event Bus did not return an unsubscribe function'), {
      code: 'EXPORT_EVENT_BUS_INVALID',
      source: SERVICE_NAME,
      type: 'startup',
      timestamp: new Date().toISOString(),
      detail: { reason: 'missing-unsubscribe' },
    });
  }
  record.unsubscribe = subscribed;
  return [{ name: SERVICE_NAME, object: createService(state) }];
}

/**
 * Activates the plugin: binds the Markdown dependency for service methods.
 * @param {Record<string, object>} services Bound declared dependencies.
 * @returns {Promise<void>}
 * @throws {object} Structured startup error when the required dependency is
 *   missing — boundary errors are always structured, startup included.
 */
export async function activate(services) {
  const markdown = services[MARKDOWN_SERVICE];
  if (!markdown) {
    throw Object.assign(new Error(`Required service is unavailable: ${MARKDOWN_SERVICE}`), {
      code: 'EXPORT_MARKDOWN_UNAVAILABLE',
      source: SERVICE_NAME,
      type: 'startup',
      timestamp: new Date().toISOString(),
      detail: { service: MARKDOWN_SERVICE },
    });
  }
  state.markdown = markdown;
}
