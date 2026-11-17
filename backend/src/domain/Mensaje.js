import { CamposInvalidos } from '../errors/index.js';

export const SenderType = Object.freeze({
  CLIENTE: 'CLIENTE',
  FREELANCER: 'FREELANCER',
});

export const MessageStatus = Object.freeze({
  PENDIENTE: 'PENDIENTE',
  ENVIADO: 'ENVIADO',
  FALLIDO: 'FALLIDO',
});

export class Mensaje {
  #pedidoId;
  #senderId;
  #senderType;
  #content;
  #status;
  #createdAt;

  constructor({ pedidoId, senderId, senderType, content, status, createdAt }) {
    this.#pedidoId = pedidoId;
    this.#senderId = senderId;
    this.#senderType = senderType;
    this.#content = content;
    this.#status = status || MessageStatus.ENVIADO;
    this.#createdAt = createdAt || new Date().toISOString();
    this.id = null;
  }

  get pedidoId() {
    return this.#pedidoId;
  }

  get senderId() {
    return this.#senderId;
  }

  get senderType() {
    return this.#senderType;
  }

  get content() {
    return this.#content;
  }

  get status() {
    return this.#status;
  }

  get enviado() {
    return this.#status === MessageStatus.ENVIADO;
  }

  get createdAt() {
    return this.#createdAt;
  }

  set setEnviado(value) {
    if (typeof value !== 'boolean') {
      throw new CamposInvalidos('El tipo a setear no es valido');
    }

    this.#status = value ? MessageStatus.ENVIADO : MessageStatus.PENDIENTE;
  }

  setStatus(status) {
    if (!Object.values(MessageStatus).includes(status)) {
      throw new CamposInvalidos('El estado del mensaje no es valido');
    }
    this.#status = status;
  }

  toJSON() {
    return {
      id: this.id,
      pedidoId: this.#pedidoId,
      senderId: this.#senderId,
      senderType: this.#senderType,
      content: this.#content,
      status: this.#status,
      createdAt: this.#createdAt,
    };
  }
}
