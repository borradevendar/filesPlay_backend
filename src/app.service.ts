import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {res: "Hello World!"};
  }

  getDevendar() {
    return {res: "Hello Devendar!"};
  }
}
