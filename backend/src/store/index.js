import { GigRepository } from '../repositories/GigRepository.js';
import { CategoriaRepository } from '../repositories/CategoriaRepository.js';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { PedidoRepository } from '../repositories/PedidoRepository.js';
import { OpinionRepository } from '../repositories/OpinionRepository.js';
import { MensajeRepository } from '../repositories/MensajeRepository.js';

export const gigRepository = new GigRepository();
export const categoriaRepository = new CategoriaRepository();
export const usuarioRepository = new UsuarioRepository();
export const pedidoRepository = new PedidoRepository();
export const opinionRepository = new OpinionRepository();
export const mensajeRepository = new MensajeRepository();
