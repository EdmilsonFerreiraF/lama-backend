export class Music {
  constructor(
    private id: string,
    private title: string,
    private author: string,
    private date: Date,
    private file: File | undefined,
    private genre: string[],
    private album: string
  ) {};

  public getId(): string {
    return this.id;
  };

  public getTitle(): string {
    return this.title;
  };

  public getAuthor(): string {
    return this.author;
  };

  public getFile(): File | undefined {
    return this.file;
  };

  public getDate(): Date {
    return this.date;
  };

  public getGenre(): string[] {
    return this.genre;
  };

  public getAlbum(): string {
    return this.album;
  };
};