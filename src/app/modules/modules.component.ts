import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, Subscription } from 'rxjs';
import { take, map, filter } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  public curSub: Subscription;
  public year: number;
  public input = '';
  public elems = 10;
  public curOffset = 0;
  public disableNext = false;

  public make: string;
  public years: number[];
  public makes: string[];
  public result: IModel[];

  public numElements = [5, 10, 20, 50, 99];
  displayedColumns: string[] = ['year', 'make', 'model'];

  constructor(private http: HttpClient) {
    this.getYears();
    this.getMakes();
    this.dataChange();
  }

  ngOnInit() {
  }

  async getYears() {
    this.years = await this.http.get<number[]>('https://vehicle-data.azurewebsites.net/api/years').toPromise();
  }

  async getMakes() {
    this.makes = await this.http.get<string[]>('https://vehicle-data.azurewebsites.net/api/makes').toPromise();
  }

  async dataChange() {
    if (!isNaN(this.year) && this.make !== undefined && this.make !== 'NONE') {
      this.result = await this.http.get<IModel[]>(`https://vehicle-data.azurewebsites.net/api/models?year=${this.year}&&make=${this.make}&&fetch=${this.elems + 1}&&offset=${this.curOffset}`).toPromise();
    } else if (!isNaN(this.year)) {
      this.result = await this.http.get<IModel[]>(`https://vehicle-data.azurewebsites.net/api/models?year=${this.year}&&fetch=${this.elems + 1}&&offset=${this.curOffset}`).toPromise();
    } else if (this.make !== undefined && this.make !== 'NONE') {
      this.result = await this.http.get<IModel[]>(`https://vehicle-data.azurewebsites.net/api/models?make=${this.make}&&fetch=${this.elems + 1}&&offset=${this.curOffset}`).toPromise();
    } else {
      this.result = await this.http.get<IModel[]>(`https://vehicle-data.azurewebsites.net/api/models?fetch=${this.elems + 1}&&offset=${this.curOffset}`).toPromise();
    }
    if (this.result.length !== this.elems + 1) {
      this.disableNext = true;
    } else {
      this.disableNext = false;
      this.result.pop();
    }
    console.log(this.disableNext);
  }

  async prev() {
    this.curOffset -= this.elems;
    await this.dataChange();
  }

  async next() {
    this.curOffset += this.elems;
    await this.dataChange();
  }
  async change() {
    this.curOffset = 0;
    await this.dataChange();
  }
  processInput() {
    const name = /[A-Za-z][A-Za-z -]+[A-Za-z]/g;
    const year = /[0-9]+/g;
    let yearRes = year.exec(this.input);
    let nameRes = name.exec(this.input);
    let yearFilter: number = yearRes == null ? NaN : parseInt(yearRes.shift());
    let nameFilter: string = nameRes == null ? undefined : nameRes.shift();
    if (!isNaN(yearFilter)) {
      let filteredYears = this.years.filter((a) => (a == yearFilter));
      if (filteredYears.length > 0) {
        this.year = filteredYears[0];
      } else {
        this.year = NaN;
      }
    } else {
      this.year = NaN;
    }
    if (nameFilter !== undefined) {
      let filteredMakes = this.makes.filter((a) => (a.toLowerCase() === nameFilter.toLowerCase()));
      if (filteredMakes.length > 0) {
        this.make = filteredMakes[0];
      } else {
        this.make = undefined;
      }
    } else {
      this.make = undefined;
    }


    const changeChecker = interval(300).pipe(take(1));

    if (this.curSub !== undefined) {
      this.curSub.unsubscribe();
    }
    this.curSub = changeChecker.subscribe(x => {
      console.log("change");
      this.dataChange();
    });
  }
}

interface IModel {
  id: number;
  year: number;
  make: string;
  model: string;
}
