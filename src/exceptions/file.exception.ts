interface FileExceptionBody {
  message: string;
  errno: number;
  syscall: string;
  code: string;
  path: string;
}

export class FileException extends Error {
  private _errno: number;

  private _code: string;

  private _path: string;

  private _syscall: string;

  constructor({ message, errno, code, path, syscall }: FileExceptionBody) {
    super(message);
    this._errno = errno;
    this._code = code;
    this._path = path;
    this._syscall = syscall;
  }

  public get errno(): number {
    return this._errno;
  }

  public get code(): string {
    return this._code;
  }

  public get path(): string {
    return this._path;
  }

  public get syscall(): string {
    return this._syscall;
  }
}
