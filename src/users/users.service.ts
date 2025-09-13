import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import fetch from 'node-fetch';

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

  async findByEmail(email_usuario: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email_usuario } });
  }

  async findOrCreateSocial(data: Partial<User>): Promise<User> {
    let user = await this.usersRepository.findOne({ where: { provider: data.provider, providerId: data.providerId } });
    if (!user) {
      user = this.usersRepository.create(data);
      await this.usersRepository.save(user);
    }
    return user;
  }
}
