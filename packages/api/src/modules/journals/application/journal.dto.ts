interface JournalDtoProps {
  title: string;
  content?: string;
}

export class JournalDto {
  private constructor(public props: JournalDtoProps) {}

  public static create(props: JournalDtoProps): JournalDto {
    return new JournalDto({
      title: props.title,
      content: props.content
    });
  }
}