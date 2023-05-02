import { Observable, of, shareReplay, Subject, switchMap } from 'rxjs';

/**
 * Буфер, имеет следующие возможности:
 * 1) Получает уведомление с параметрами для перезапроса данных
 * 2) Запрашивают данные, сохраняет их и раздает подписчикам
 * 3) Может сбросить сохраненное значение до null
 * */
export class BufferSubject<TParams, TValue> {
    public get value$(): Observable<TValue | null> {
        return this._getter$;
    }

    private readonly _updater$: Subject<TParams | null | void> = new Subject<TParams | null | void>();
    private readonly _operations: (value?: TParams) => Observable<TValue>;
    private _getter$: Subject<TValue | null> = new Subject<TValue | null>();

    constructor({ operations }: { operations: (value?: TParams) => Observable<TValue> }) {
        this._operations = operations;
        this.createBuffer();
    }

    public update(value?: TParams): void {
        if (value !== null) {
            if (value === undefined) {
                this._updater$.next();
            } else {
                this._updater$.next(value);
            }
        }
    }

    public recreateBuffer(): void {
        this._updater$.next(null);
    }

    private createBuffer(): void {
        this._updater$
            .pipe(
                switchMap((value: TParams | null | void) => {
                    if (value === null) {
                        return of(null);
                    } else if (value === void 0) {
                        return this._operations();
                    } else {
                        return this._operations(value);
                    }
                }),
                shareReplay(1)
            )
            .subscribe(this._getter$);
    }
}
