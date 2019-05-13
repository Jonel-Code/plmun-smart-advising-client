import {HttpInterceptor, HttpRequest, HttpEvent, HttpHandler, HttpParams, HttpParameterCodec} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
        return standardEncoding(key);
    }

    encodeValue(value: string): string {
        // const new_val = standardEncoding(value);
        // console.log('new_val', new_val);
        return standardEncoding(value);
    }

    decodeKey(key: string): string {
        return decodeURIComponent(key);
    }

    decodeValue(value: string) {
        return decodeURIComponent(value);
    }
}

function standardEncoding(v: string): string {
    return encodeURIComponent(v)
        .replace(/%40/gi, '@')
        .replace(/%3A/gi, ':')
        .replace(/%24/gi, '$')
        .replace(/%2C/gi, ',')
        .replace(/%3B/gi, ';')
        .replace('+', '%2B')
        .replace(/%3D/gi, '=')
        .replace(/%3F/gi, '?')
        .replace(/%2F/gi, '/');
}

// export class EncodeHttpParamsInterceptor implements HttpInterceptor {
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const params = new HttpParams({encoder: new CustomEncoder(), fromString: req.params.toString()});
//         return next.handle(req.clone({params}));
//     }
// }
