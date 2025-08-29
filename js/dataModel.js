export let project = {
  app: "Subtly",
  version: "1.0",
  subtitleFile: "",
  dateCreated: new Date().toISOString(),
  subtitles: [
    { id: "s1", start: "00:00:01", end: "00:00:04", text: "Hello world!" },
    {
      id: "s2",
      start: "00:00:05",
      end: "00:00:07",
      text: "This is a sample subtitle.",
    },
    {
      id: "s3",
      start: "00:00:08",
      end: "00:00:10",
      text: "You can select multiple parts.",
    },
  ],
  words: [],
};
