import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
const fetch = require('node-fetch');
// Função para buscar lat/lng via API de geolocalização
async function fetchLatLngFromCep(cep: string): Promise<{ lat: number, lng: number } | null> {
  try {
    const viaCepUrl = process.env.VIACEP_URL;
    const nominatimUrl = process.env.NOMINATIM_URL;
    const viaCepResp = await fetch(`${viaCepUrl}/${cep}/json/`);
    const viaCepData = await viaCepResp.json() as any;
    
    if (!viaCepData || !viaCepData.logradouro || !viaCepData.localidade || !viaCepData.uf) return null;
    
    const address = `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}`;
    
    const nominatimResp = await fetch(`${nominatimUrl}?format=json&q=${encodeURIComponent(address)}`);
    const nominatimData = await nominatimResp.json() as any;
    if (nominatimData && nominatimData.length > 0) {
      return { lat: parseFloat(nominatimData[0].lat), lng: parseFloat(nominatimData[0].lon) };
    }
    return null;
  } catch (e) {
    return null;
  }
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}


  async create(data: Partial<User>): Promise<User> {
    let lat = null;
    let lng = null;
    if (data.cep) {
      const geo = await fetchLatLngFromCep(data.cep);
      if (geo) {
        lat = geo.lat;
        lng = geo.lng;
      }
    }
    const user = this.usersRepository.create({ ...data, lat, lng });
    return this.usersRepository.save(user);
  }

  async findByIdWithInterests(id_usuario: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id_usuario },
      relations: ['usuarioInteresses', 'usuarioInteresses.interest'],
    });
    if (!user) return null;
    // Monta resposta amigável para o front
    return {
      id: user.id_usuario,
      nome: user.nome_usuario,
      email: user.email_usuario,
      telefone: user.telefone_usuario,
      dataNascimento: user.dt_nasc,
      cpf: user.cpf,
      contatoEmergencia: user.contato_emerg,
      cep: user.cep,
      numero: user.num_endereco,
      complemento: user.complemento_endereco,
      interesses: user.usuarioInteresses?.map(ui => ({
        id_interesse: ui.interest.id_interesse,
        descricao: ui.interest.descricao,
      })) || [],
    };
  }

  async updateUserProfile(id_usuario: number, data: any): Promise<void> {
    const updateData: any = {
      nome_usuario: data.nome,
      email_usuario: data.email,
      telefone_usuario: data.telefone,
      dt_nasc: data.dataNascimento,
      cpf: data.cpf,
      contato_emerg: data.contatoEmergencia,
      cep: data.cep,
      num_endereco: data.numero,
      complemento_endereco: data.complemento,
    };
    await this.usersRepository.update(id_usuario, updateData);
  }

  async findByEmail(email_usuario: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email_usuario } });
  }

  async findOrCreateSocial(data: Partial<User>): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { provider: data.provider, providerId: data.providerId } });
    if (!user) {
      // Ensure cod_tip_usuario has a sensible default when creating social users
      const defaultTipo = parseInt(process.env.GOOGLE_DEFAULT_USER_TYPE || '2', 10);
      const createData = {
        ...data,
        cod_tip_usuario: data.cod_tip_usuario || defaultTipo,
      } as Partial<User>;
      user = this.usersRepository.create(createData);
      await this.usersRepository.save(user);
    }
    return user;
  }
}
