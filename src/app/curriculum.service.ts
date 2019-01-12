import {Injectable} from '@angular/core';
import {ISubject} from './subject';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../environments/environment';

@Injectable()
export class CurriculumService {

  private url = `${environment.base_url}/subject`;
  private subjectCurriculumTree = this.url + '/curriculumTree';

  constructor(private http: HttpClient) {
  }

  getData() {

    return this.http.get(this.subjectCurriculumTree)
      .pipe(map(result => result));
  }
}

export class Suject implements ISubject {
  child: number;
  is_parent: boolean;
  level: number;
  parent: number;

  constructor(child, is_parent, level, parent) {
    this.child = child;
    this.is_parent = is_parent;
    this.level = level;
    this.parent = parent;
  }
}
