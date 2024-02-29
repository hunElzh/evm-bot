import 'dotenv/config'
import {contracts} from './contract'
import {chainList} from './chain'
import { rpcs } from './rpc';
import { domains } from './domain';
import { tokens } from './token';

export const contract = contracts;

export const chain = chainList;

export const token = tokens;

export const rpc = rpcs;

export const domain = domains;

