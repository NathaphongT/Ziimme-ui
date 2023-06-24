import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, ReplaySubject, map, switchMap, take, tap } from "rxjs";
import { Branch, Course, Districts, Position, PostCode, Province, Salary, SubDistricts } from "./basic.model";
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { BranchPagination, CoursePagination, PaginationResponse, PositionPagination } from "@app/_service/pagination.types";
@Injectable({
    providedIn: 'root'
})

export class BasicService {

    private _apiPath = environment.APIURL_LOCAL + '/api/v1.0';

    private _courses: BehaviorSubject<Course[] | null> = new BehaviorSubject(null);
    private _coursesPagination: BehaviorSubject<CoursePagination | null> = new BehaviorSubject(null);

    private _positions: BehaviorSubject<Position[] | null> = new BehaviorSubject(null);
    private _positionsPagination: BehaviorSubject<PositionPagination | null> = new BehaviorSubject(null);

    private _branchs: BehaviorSubject<Branch[] | null> = new BehaviorSubject(null);
    private _branchsPagination: BehaviorSubject<BranchPagination | null> = new BehaviorSubject(null);

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
    //Course
    get courses$(): Observable<Course[]> {
        return this._courses.asObservable();
    }

    get coursesPagination$(): Observable<CoursePagination> {
        return this._coursesPagination.asObservable();
    }

    //Positions
    get positions$(): Observable<Position[]> {
        return this._positions.asObservable();
    }

    get positionsPagination$(): Observable<PositionPagination> {
        return this._positionsPagination.asObservable();
    }

    //Branchs
    get branchs$(): Observable<Branch[]> {
        return this._branchs.asObservable();
    }

    get branchsPagination$(): Observable<BranchPagination> {
        return this._branchsPagination.asObservable();
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


    // ignored pagination
    getAllCourse(): Observable<Position[]> {
        return this._httpClient.get(this._apiPath + '/courses', {
            params: {
                q: '',
                page: '1',
                limit: 300
            }
        }).pipe(
            map((res: any) => res.data),
            tap((courses: any) => {
                this._courses.next(courses);
            })
        );
    }

    getCourse(search: string = "", page: number = 1, limit: number = 10, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc'): Observable<{ pagination: CoursePagination, courses: Course[] }> {
        return this._httpClient.get<PaginationResponse>(this._apiPath + '/courses', {
            params: {
                q: search,
                page: page.toString(),
                limit: limit.toString(),
                sort,
                order
            }
        }).pipe(
            map(response => {

                const ret: { pagination: CoursePagination, courses: Course[] } = {
                    pagination: {
                        length: response.totalItems,
                        size: limit,
                        page: response.currentPage - 1,
                        lastPage: response.totalPages,
                        startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
                        endIndex: Math.min(response.currentPage * limit, response.totalItems)
                    },
                    courses: response.data
                };

                this._coursesPagination.next(ret.pagination);
                this._courses.next(ret.courses);

                return ret;

            })
        );
    }

    createCourse(data: Course): Observable<Course> {
        return this.courses$.pipe(
            take(1),
            switchMap((courses) =>
                this._httpClient
                    .post<Course>(`${environment.APIURL_LOCAL}/api/v1.0/courses`, data)
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
                    .put<Course>(`${environment.APIURL_LOCAL}/api/v1.0/courses/${id}`,
                        data
                    )
                    .pipe(
                        map((updatedCourse: Course) => {
                            // Find the index of the updated courses
                            const index = courses.findIndex(
                                (item) => item.courseId === id
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
                    .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/courses/${id}`)
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted user
                            const index = courses.findIndex(
                                (item) => item.courseId === id
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

    // ignored pagination
    getAllPosition(): Observable<Position[]> {
        return this._httpClient.get(this._apiPath + '/positions', {
            params: {
                q: '',
                page: '1',
                limit: 300
            }
        }).pipe(
            map((res: any) => res.data),
            tap((positions: any) => {
                this._positions.next(positions);
            })
        );
    }

    getPosition(search: string = "", page: number = 1, limit: number = 10, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc'): Observable<{ pagination: PositionPagination, positions: Position[] }> {
        return this._httpClient.get<PaginationResponse>(this._apiPath + '/positions', {
            params: {
                q: search,
                page: page.toString(),
                limit: limit.toString(),
                sort,
                order
            }
        }).pipe(
            map(response => {

                const ret: { pagination: PositionPagination, positions: Position[] } = {
                    pagination: {
                        length: response.totalItems,
                        size: limit,
                        page: response.currentPage - 1,
                        lastPage: response.totalPages,
                        startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
                        endIndex: Math.min(response.currentPage * limit, response.totalItems)
                    },
                    positions: response.data
                };

                this._positionsPagination.next(ret.pagination);
                this._positions.next(ret.positions);

                return ret;

            })
        );
    }

    createPosition(data: Position): Observable<Position> {
        return this.positions$.pipe(
            take(1),
            switchMap((positions) =>
                this._httpClient
                    .post<Position>(`${environment.APIURL_LOCAL}/api/v1.0/positions`, data)
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
                    .put<Position>(`${environment.APIURL_LOCAL}/api/v1.0/positions/${id}`,
                        data
                    )
                    .pipe(
                        map((updatedPosition: Position) => {
                            // Find the index of the updated positions
                            const index = positions.findIndex(
                                (item) => item.positionId === id
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
                    .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/positions/${id}`)
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted user
                            const index = positions.findIndex(
                                (item) => item.positionId === id
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

    // ignored pagination
    getAllBranch(): Observable<Branch[]> {
        return this._httpClient.get(this._apiPath + '/branchs', {
            params: {
                q: '',
                page: '1',
                limit: 300
            }
        }).pipe(
            map((res: any) => res.data),
            tap((branchs: any) => {
                this._branchs.next(branchs);
            })
        );
    }

    getBranch(search: string = "", page: number = 1, limit: number = 10, sort: string = 'createdTime', order: 'asc' | 'desc' | '' = 'asc'): Observable<{ pagination: BranchPagination, branchs: Branch[] }> {
        return this._httpClient.get<PaginationResponse>(this._apiPath + '/branchs', {
            params: {
                q: search,
                page: page.toString(),
                limit: limit.toString(),
                sort,
                order
            }
        }).pipe(
            map(response => {

                const ret: { pagination: BranchPagination, branchs: Branch[] } = {
                    pagination: {
                        length: response.totalItems,
                        size: limit,
                        page: response.currentPage - 1,
                        lastPage: response.totalPages,
                        startIndex: response.currentPage > 1 ? (response.currentPage - 1) * limit : 0,
                        endIndex: Math.min(response.currentPage * limit, response.totalItems)
                    },
                    branchs: response.data
                };

                this._branchsPagination.next(ret.pagination);
                this._branchs.next(ret.branchs);

                return ret;

            })
        );
    }

    createBranch(data: Branch): Observable<Branch> {
        return this.branchs$.pipe(
            take(1),
            switchMap((branchs) =>
                this._httpClient
                    .post<Branch>(this._apiPath + '/branchs', data)
                    .pipe(
                        map((newBranch) => {
                            // Update the branchs with the new branchs
                            this._branchs.next([...branchs, newBranch]);

                            // Return the new branchs from observable
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
                    .put<Branch>(`${environment.APIURL_LOCAL}/api/v1.0/branchs/${id}`,
                        data
                    )
                    .pipe(
                        map((updatedBranch: Branch) => {
                            // Find the index of the updated branchs
                            const index = branchs.findIndex(
                                (item) => item.branchId === id
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
                    .delete<boolean>(`${environment.APIURL_LOCAL}/api/v1.0/branchs/${id}`)
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted branch
                            const index = branchs.findIndex(
                                (item) => item.branchId === id
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