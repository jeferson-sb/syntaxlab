import { AggregateRoot } from "./AggregateRoot";

export type DataMapper<AR extends AggregateRoot<any>, DATA> = {
  toEntity(data: DATA): AR;
  toData(entity: AR): DATA;
};