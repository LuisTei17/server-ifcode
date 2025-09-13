import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './user.entity';
import { UsuarioInteresse } from './usuario-interesse.entity';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuarioRankingController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UsuarioInteresse)
    private readonly usuarioInteresseRepository: Repository<UsuarioInteresse>,
  ) {}

  // GET /usuarios/ranking/:id
  @Get('ranking/:id')
  @ApiOperation({ summary: 'Ranking de usuários por interesses, proximidade e idade' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do usuário base' })
    @ApiResponse({
      status: 200,
      description: 'Lista de usuários ranqueados',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id_usuario: { type: 'integer', example: 2 },
                nome_usuario: { type: 'string', example: 'Maria' },
                email_usuario: { type: 'string', example: 'maria@email.com' },
                cod_tip_usuario: { type: 'integer', example: 3 },
                lat: { type: 'number', example: -23.5 },
                lng: { type: 'number', example: -46.6 },
                dt_nasc: { type: 'string', format: 'date', example: '1992-05-10' },
                correlacionados: { type: 'integer', example: 2 },
                dist: { type: 'number', example: 5.2 },
                diffIdade: { type: 'integer', example: 2 },
                usuarioInteresses: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id_usuario_interesse: { type: 'integer', example: 1 },
                      interest: {
                        type: 'object',
                        properties: {
                          id_interesse: { type: 'integer', example: 1 },
                          descricao: { type: 'string', example: 'Esportes' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
  async getRankedUsuarios(
    @Param('id') id: number
  ) {
    // 1. Busca o usuário base
    const baseUser = await this.userRepository.findOne({ where: { id_usuario: id } });
    if (!baseUser) return [];

    // 2. Busca todos usuários de tipo diferente
    const usuarios = await this.userRepository.find({ where: { cod_tip_usuario: Not(baseUser.cod_tip_usuario) } });

    // 3. Busca interesses do usuário base
    const baseInteresses = await this.usuarioInteresseRepository.find({ where: { user: { id_usuario: id } } });
    const baseInteresseIds = baseInteresses.map(i => i.interest.id_interesse);

    // 4. Rankeia por distância (CEP) e interesses correlacionados
    const ranked = await Promise.all(usuarios.map(async u => {
      // Interesses correlacionados
      const interesses = await this.usuarioInteresseRepository.find({ where: { user: { id_usuario: u.id_usuario } } });
      const interesseIds = interesses.map(i => i.interest.id_interesse);
      const correlacionados = baseInteresseIds.filter(id => interesseIds.includes(id)).length;

      // Distância por lat/lng (Haversine)
      const dist = getDistance(
        { lat: baseUser.lat, lng: baseUser.lng },
        { lat: u.lat, lng: u.lng }
      );

      // Diferença de idade (em anos)
      let idadeBase = baseUser.dt_nasc ? getAge(baseUser.dt_nasc) : null;
      let idadeU = u.dt_nasc ? getAge(u.dt_nasc) : null;
      let diffIdade = (idadeBase !== null && idadeU !== null) ? Math.abs(idadeBase - idadeU) : Infinity;

      return { usuario: u, correlacionados, dist, diffIdade };
    }));

    // Ordena por correlacionados (desc) e distância (asc)
      // Ordena por: interesses (desc), proximidade (asc), idades parecidas (asc)
      ranked.sort((a, b) =>
        b.correlacionados - a.correlacionados ||
        a.dist - b.dist ||
        a.diffIdade - b.diffIdade
      );
    return ranked.map(r => r.usuario);
  }
}
function getDistance(a: { lat: number, lng: number }, b: { lat: number, lng: number }) {
  if (!a.lat || !a.lng || !b.lat || !b.lng) return Infinity;
  const toRad = (v: number) => v * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const aVal = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1-aVal));
  return R * c;
}

function getAge(date: Date): number {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}
