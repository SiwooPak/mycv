import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
    new (...args: any[]): {};
}

export const Serialize = (dto: ClassConstructor) => UseInterceptors(new SerializeInterceptor(dto));

class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    // 핸들러가 요청을 처리하기 전에 어떤 것을 실행한다.
    // 이게 인터셉터
    // console.log(`Im running before the handler. `, context);
    return handler.handle().pipe(
      map((data: any) => {
        // console.log(`Im running before response is sent out. `, data);
        // delete data.password;
        return plainToInstance(this.dto, data, {
          // DTO의 해당된 데이터만 보내줌
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

