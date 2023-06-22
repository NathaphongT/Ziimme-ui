import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, ReplaySubject, map, switchMap, take, tap } from "rxjs";
import { Branch, Course, Districts, Position, PostCode, Province, Salary, SubDistricts } from "./basic.model";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})

export class BasicService {
    private _course: ReplaySubject<Course> = new ReplaySubject<Course>(1);
    private _courses: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>(null);

    private _position: ReplaySubject<Position> = new ReplaySubject<Position>(1);
    private _positions: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>(null);

    private _branch: ReplaySubject<Branch> = new ReplaySubject<Branch>(1);
    private _branchs: BehaviorSubject<Branch[]> = new BehaviorSubject<Branch[]>(null);

    private _province: ReplaySubject<Province> = new ReplaySubject<Province>(1);
    private _provinces: BehaviorSubject<Province[]> = new BehaviorSubject<Province[]>(null);

    private _district: ReplaySubject<Districts> = new ReplaySubject<Districts>(1);
    private _districts: BehaviorSubject<Districts[]> = new BehaviorSubject<Districts[]>(null);

    private _subdistrict: ReplaySubject<SubDistricts> = new ReplaySubject<SubDistricts>(1);
    private _subdistricts: BehaviorSubject<SubDistricts[]> = new BehaviorSubject<SubDistricts[]>(null);


    private _postcode: ReplaySubject<PostCode> = new ReplaySubject<PostCode>(1);
    private _postcodes: BehaviorSubject<PostCode[]> = new BehaviorSubject<PostCode[]>(null);

    constructor(private _httpClient: HttpClient) { }

    /**
   * Setter & getter for user
   *
   * @param value
   */
    set course(value: Course) {
        // Store the value
        this._course.next(value);
    }

    get course$(): Observable<Course> {
        return this._course.asObservable();
    }

    get courses$(): Observable<Course[]> {
        return this._courses.asObservable();
    }

    set position(value: Position) {
        // Store the value
        this._position.next(value);
    }

    get position$(): Observable<Position> {
        return this._position.asObservable();
    }

    get positions$(): Observable<Position[]> {
        return this._positions.asObservable();
    }

    set branch(value: Branch) {
        // Store the value
        this._branch.next(value);
    }

    get branchs$(): Observable<Branch[]> {
        return this._branchs.asObservable();
    }

    get branch$(): Observable<Branch> {
        return this._branch.asObservable();
    }

    get provinces$(): Observable<Province[]> {
        return this._provinces.asObservable();
    }
    get province$(): Observable<Province> {
        return this._province.asObservable();
    }

    get districts$(): Observable<Districts[]> {
        return this._districts.asObservable();
    }
    get district$(): Observable<Districts> {
        return this._district.asObservable();
    }

    get subdistricts$(): Observable<SubDistricts[]> {
        return this._subdistricts.asObservable();
    }
    get subdistrict$(): Observable<SubDistricts> {
        return this._subdistrict.asObservable();
    }

    get postcodes$(): Observable<PostCode[]> {
        return this._postcodes.asObservable();
    }
    get postcode$(): Observable<PostCode> {
        return this._postcode.asObservable();
    }


    getAllCourse(): Observable<Course[]> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/course/`).pipe(
            tap((course: Course[]) => {
                this._courses.next(course)
            })
        );
    }

    createCourse(data: Course): Observable<Course> {
        return this.courses$.pipe(
            take(1),
            switchMap((courses) =>
                this._httpClient
                    .post<Course>(`${environment.APIURL_LOCAL}/api/v1.0/course`, data)
                    .pipe(
                        map((newCourse) => {
                            // Update the course with the new course
                            this._courses.next([...courses, newCourse]);

                            // Return the new categorys from observable
                            return newCourse;
                        })
                    )
            )
        );
    }

    updateCourse(id: number, data: Course): Observable<Course> {
        return this.courses$.pipe(
            take(1),
            switchMap((courses) =>
                this._httpClient
                    .put<Course>(`${environment.APIURL_LOCAL}/api/v1.0/course/${id}`,
                        data
                    )
                    .pipe(
                        map((updatedCourse: Course) => {
                            // Find the index of the updated courses
                            const index = courses.findIndex(
                                (item) => item.course_id === id
                            );

                            // Update the courses
                            courses[index] = updatedCourse;

                            // Update the courses
                            this._courses.next(courses);

                            // Return the updated courses
                            return updatedCourse;
                        })
                    )
            )
        );
    }

    deleteCourse(id: number): Observable<boolean> {
        return this.courses$.pipe(
            take(1),
            switchMap((courses) =>
                this._httpClient
                    .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/course/${id}`)
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted user
                            const index = courses.findIndex(
                                (item) => item.course_id === id
                            );

                            // Delete the user
                            courses.splice(index, 1);

                            // Update the courses
                            this._courses.next(courses);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    getAllPosition(): Observable<Position[]> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/position/`).pipe(
            tap((position: Position[]) => {
                this._positions.next(position)
            })
        );
    }

    createPosition(data: Position): Observable<Position> {
        return this.positions$.pipe(
            take(1),
            switchMap((positions) =>
                this._httpClient
                    .post<Position>(`${environment.APIURL_LOCAL}/api/v1.0/position`, data)
                    .pipe(
                        map((newPosition) => {
                            // Update the course with the new course
                            this._positions.next([...positions, newPosition]);

                            // Return the new categorys from observable
                            return newPosition;
                        })
                    )
            )
        );
    }

    updatePosition(id: number, data: Position): Observable<Position> {
        return this.positions$.pipe(
            take(1),
            switchMap((positions) =>
                this._httpClient
                    .put<Position>(`${environment.APIURL_LOCAL}/api/v1.0/position/${id}`,
                        data
                    )
                    .pipe(
                        map((updatedPosition: Position) => {
                            // Find the index of the updated positions
                            const index = positions.findIndex(
                                (item) => item.position_id === id
                            );

                            // Update the positions
                            positions[index] = updatedPosition;

                            // Update the positions
                            this._positions.next(positions);

                            // Return the updated positions
                            return updatedPosition;
                        })
                    )
            )
        );
    }

    deletePosition(id: number): Observable<boolean> {
        console.log(id);
        return this.positions$.pipe(
            take(1),
            switchMap((positions) =>
                this._httpClient
                    .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/position/${id}`)
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted user
                            const index = positions.findIndex(
                                (item) => item.position_id === id
                            );

                            // Delete the user
                            positions.splice(index, 1);

                            // Update the positions
                            this._positions.next(positions);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    getAllBranch(): Observable<Branch[]> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/branch/`).pipe(
            tap((branch: Branch[]) => {
                this._branchs.next(branch)
            })
        );
    }

    createBranch(data: Branch): Observable<Branch> {
        return this.branchs$.pipe(
            take(1),
            switchMap((branchs) =>
                this._httpClient
                    .post<Branch>(`${environment.APIURL_LOCAL}/api/v1.0/branch`, data)
                    .pipe(
                        map((newBranch) => {
                            // Update the branch with the new branch
                            this._branchs.next([...branchs, newBranch]);

                            // Return the new branch from observable
                            return newBranch;
                        })
                    )
            )
        );
    }

    updateBranch(id: number, data: Branch): Observable<Branch> {
        return this.branchs$.pipe(
            take(1),
            switchMap((branchs) =>
                this._httpClient
                    .put<Branch>(`${environment.APIURL_LOCAL}/api/v1.0/branch/${id}`,
                        data
                    )
                    .pipe(
                        map((updatedBranch: Branch) => {
                            // Find the index of the updated branchs
                            const index = branchs.findIndex(
                                (item) => item.branch_id === id
                            );

                            // Update the branchs
                            branchs[index] = updatedBranch;

                            // Update the branchs
                            this._branchs.next(branchs);

                            // Return the updated branchs
                            return updatedBranch;
                        })
                    )
            )
        );
    }

    deleteBranch(id: number): Observable<boolean> {
        console.log(id);
        return this.branchs$.pipe(
            take(1),
            switchMap((branchs) =>
                this._httpClient
                    .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/branch/${id}`)
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted branch
                            const index = branchs.findIndex(
                                (item) => item.branch_id === id
                            );

                            // Delete the branch
                            branchs.splice(index, 1);

                            // Update the branchs
                            this._branchs.next(branchs);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    getProvinceBYID(id: number): Observable<any> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/districts/${id}`).pipe(
            map((res: any) => res.data)
        );
    }

    getDistrictsBYID(id: number): Observable<any> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sub_districts/${id}`).pipe(
            map((res: any) => res.data)
        );
    }

    getSubDistrictsBYID(id: number): Observable<any> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sub/${id}`).pipe(
            map((res: any) => res.data)
        );
    }

    getAllProvince(): Observable<Province[]> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/province/`).pipe(
            map((res: any) => res),
            tap((socials: Province[]) => {
                this._provinces.next(socials);
            })
        );
    }

    getAllDistricts(): Observable<Districts[]> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/districts/`).pipe(
            map((res: any) => res),
            tap((district: Districts[]) => {
                this._districts.next(district)
            })
        );
    }

    getAllSubDistricts(): Observable<SubDistricts[]> {
        return this._httpClient.get(`${environment.APIURL_LOCAL}/api/v1.0/sub_districts/`).pipe(
            map((res: any) => res),
            tap((subdistrict: SubDistricts[]) => {
                this._subdistricts.next(subdistrict)
            })
        );
    }

    saveBook(books) {
        console.log(JSON.stringify(books));
    }

}