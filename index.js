// Pey export plugin: entry point wiring prepare/activate.
import { MARKDOWN_SERVICE, SERVICE_NAME, createService } from './lib/export-service.js';

const state = { markdown: null };
let savedContext = null;
let unsubscribeUnavailable = null;

/**
 * Reports a critical error when the required Markdown service disappears at
 * runtime. Settlement already handles startup-time absence automatically.
 * @param {object} event Core event envelope.
 * @returns {void}
 */
function handleServiceUnavailable(event) {
  if (event?.data?.serviceName !== MARKDOWN_SERVICE || !savedContext) {
    return;
  }
  savedContext.reportCriticalError({
    code: 'REQUIRED_DEPENDENCY_LOST',
    message: `Required service ${MARKDOWN_SERVICE} is no longer available`,
    source: SERVICE_NAME,
    type: 'critical',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Releases this prepare() call's resources: the dependency reference goes
 * away and the core:service-unavailable listener leaves the Event Bus, so a
 * lost-dependency event after shutdown can never report a critical error
 * for a dead plugin.
 */
function teardown() {
  state.markdown = null;
  if (unsubscribeUnavailable !== null) {
    unsubscribeUnavailable();
    unsubscribeUnavailable = null;
  }
}

/**
 * Prepares the plugin: builds the service and registers lifecycle hooks.
 * @param {object} prepareContext Bonyan preparation context.
 * @returns {Promise<Array>} Service registration.
 */
export async function prepare(prepareContext) {
  // A repeated prepare() call must not leave the previous call's listener
  // behind on the Event Bus.
  teardown();
  savedContext = prepareContext;
  // The runtime dependency-loss safety net needs the Event Bus contract:
  // its absence is a broken host, so it fails loudly at startup instead of
  // silently arming nothing.
  const subscribe = prepareContext.events?.subscribe;
  if (typeof subscribe !== 'function') {
    throw Object.assign(new Error('Prepare context does not provide an Event Bus'), {
      code: 'EXPORT_EVENT_BUS_INVALID',
      source: SERVICE_NAME,
      type: 'startup',
      timestamp: new Date().toISOString(),
      detail: { reason: 'missing-event-bus' },
    });
  }
  const subscribed = subscribe.call(prepareContext.events, 'core:service-unavailable', handleServiceUnavailable);
  if (typeof subscribed !== 'function') {
    throw Object.assign(new Error('The Event Bus did not return an unsubscribe function'), {
      code: 'EXPORT_EVENT_BUS_INVALID',
      source: SERVICE_NAME,
      type: 'startup',
      timestamp: new Date().toISOString(),
      detail: { reason: 'missing-unsubscribe' },
    });
  }
  unsubscribeUnavailable = subscribed;
  prepareContext.onDeactivated = () => teardown();
  prepareContext.onShutdown = async () => teardown();
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
