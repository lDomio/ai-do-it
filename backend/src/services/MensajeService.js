import { MensajeRepository } from '../repositories/MensajeRepository.js';
import { PedidoService } from './PedidoService.js';
import { SenderType } from '../domain/Mensaje.js';
import { ForbiddenError, ValidationError } from '../errors/index.js';
import { EstadoPedido } from '../enums/EstadoPedido.js';

const MAX_MESSAGE_LENGTH = 2000;
const TERMINAL_STATES = Object.freeze([EstadoPedido.CANCELADO, EstadoPedido.ENTREGADO]);

export class MensajeService {
  #repository;
  #pedidoService;

  constructor(repository = new MensajeRepository(), pedidoService = new PedidoService()) {
    this.#repository = repository;
    this.#pedidoService = pedidoService;
  }

  #validateContent(content) {
    const trimmed = typeof content === 'string' ? content.trim() : '';
    if (trimmed.length === 0) {
      throw new ValidationError('El mensaje no puede estar vacio');
    }
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      throw new ValidationError(`El mensaje no puede exceder los ${MAX_MESSAGE_LENGTH} caracteres`);
    }
    return trimmed;
  }

  #resolveSenderType(senderId, pedido, gig) {
    if (senderId === pedido.cliente) {
      return SenderType.CLIENTE;
    }
    if (senderId === gig.vendedor) {
      return SenderType.FREELANCER;
    }
    return null;
  }

  findAll() {
    return this.#repository.findAll();
  }

  findById(id) {
    return this.#repository.findById(id);
  }

  listMessagesForPedido(pedidoId, senderUser) {
    const { pedido, gig } = this.#pedidoService.assertParticipante(pedidoId, senderUser.id);

    const senderType = this.#resolveSenderType(senderUser.id, pedido, gig);
    if (!senderType) {
      throw new ForbiddenError('No tienes permiso para acceder a este chat');
    }

    const messages = this.#repository.findByPedidoId(pedidoId);
    return { messages, unreadCount: 0 };
  }

  sendMessage(pedidoId, senderUser, content) {
    const { pedido, gig } = this.#pedidoService.assertParticipante(pedidoId, senderUser.id);

    if (TERMINAL_STATES.includes(pedido.estado)) {
      throw new ForbiddenError('El pedido esta cerrado; no se permiten nuevos mensajes');
    }

    const senderType = this.#resolveSenderType(senderUser.id, pedido, gig);
    const trimmedContent = this.#validateContent(content);

    const mensaje = this.#repository.create({
      pedidoId,
      senderId: senderUser.id,
      senderType,
      content: trimmedContent,
    });

    return mensaje;
  }

  update(id, datos) {
    return this.#repository.update(id, datos);
  }

  delete(id) {
    return this.#repository.delete(id);
  }
}
