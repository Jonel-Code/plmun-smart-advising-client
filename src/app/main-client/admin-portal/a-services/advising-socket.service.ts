import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable, Subject} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map} from 'rxjs/operators';

// import * as Rx from 'rxjs/Rx';

export interface IAdvisingEventContext {
    removed: any[];
    added: any[];
}

@Injectable({
    providedIn: 'root'
})
export class AdvisingSocketService {

    private conn_uri = environment.base_socket_uri + '/advising';
    private advising_socket_name = '';

    private emmiter_uri = environment.base_api_url + '/test/emmit';

    private advising_emmiter_uri = environment.base_api_url + '/socket/advising-stats';

    private socket;

    constructor(private _http: HttpClient) {
        this.socket = io.connect(this.conn_uri);
        // const conn =
    }

    public getRemovedAddedSocket() {
        return Observable.create((observer) => {
            this.socket.on('new advising form submitted', (data) => {
                console.log('new advising form submitted data', data);
                observer.next(<IAdvisingEventContext>data['data']['content']);
            });
        });
    }

    public get_test_emit() {
        return Observable.create((observer) => {
            this.socket.on('connect', (data) => {
                console.log('data connect', data);
                observer.next(data);
            });
        });
    }

    public get_test_my_event() {
        return Observable.create((observer) => {
            this.socket.on('my event', (data) => {
                console.log('my event', data);
                observer.next(data);
            });
        });
    }

    public fire_test_emit() {
        // this.socket.emit('test-emit', {'message': 'test emit fire'});
        this.call_rest_emmiter()
            .then(x => {
                // console.log('call_rest_emmiter()', x);
            });
    }

    public call_rest_emmiter() {
        const params = new HttpParams()
            .set('content', 'from client');
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            params: params
        };

        return this._http.get(this.emmiter_uri, httpOptions)
            .pipe(map(result => {
                return result;
            }))
            .toPromise();
    }

    public emit_advising_form(data = {}) {
        const params = new HttpParams()
            .set('content', JSON.stringify(data));
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            observe: 'response' as 'body'
        };

        return this._http.post(this.advising_emmiter_uri, params.toString(), httpOptions)
            .toPromise();
    }

    // connect(): Subject<IAdvisingEventContext> {
    //     // If you aren't familiar with environment variables then
    //     // you can hard code `environment.ws_url` as `http://localhost:5000`
    //     this.socket = io(this.conn_uri);
    //
    //     // We define our observable which will observe any incoming messages
    //     // from our socket.io server.
    //     const observable = new Observable(obs => {
    //         this.socket.on(this.advising_scoket_name, (data) => {
    //             console.log('Received message from Websocket Server');
    //             obs.next(data);
    //         });
    //         return () => {
    //             this.socket.disconnect();
    //         };
    //     });
    //
    //     // We define our Observer which will listen to messages
    //     // from our other components and send messages back to our
    //     // socket server whenever the `next()` method is called.
    //     const observer = {
    //         next: (data: Object) => {
    //             this.socket.emit('message', JSON.stringify(data));
    //         },
    //     };
    //
    //     // we return our Rx.Subject which is a combination
    //     // of both an observer and observable.
    //     return Subject.create(observer, observable);
    // }
}
