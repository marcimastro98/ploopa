import { EventEmitter } from "events";

/**
 * ReactionEmitter è un event bus globale per le reazioni in overlay.
 * Qualsiasi componente può emettere o ascoltare nuove reazioni (emoji o testo).
 */
class ReactionEmitterClass extends EventEmitter {}

export const ReactionEmitter = new ReactionEmitterClass();
