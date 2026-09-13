export type TalkLink = {
  label: string;
  url: string;
};

export type Talk = {
  year: number;
  event: string;
  url: string;
  date: string;
  extras: TalkLink[];
};

/** Every talk, newest first. Migrated verbatim from the WordPress speaking page. */
export const talks: Talk[] = [
  {
    year: 2018,
    event: "WordCamp for Publishers",
    url: "https://2018-chicago.publishers.wordcamp.org/",
    date: "August 8, 2018",
    extras: [],
  },
  {
    year: 2017,
    event: "WordPress NYC Meetup",
    url: "https://www.meetup.com/WordPressNYC/events/238416483/",
    date: "March 21, 2017",
    extras: [],
  },
  {
    year: 2017,
    event: "BigWP Meetup @ Google",
    url: "https://www.meetup.com/Big-WP-NYC/events/235270074/",
    date: "March 7, 2017",
    extras: [
      { label: "case study", url: "https://vip.wordpress.com/case-studies/the-platform-of-record-for-usa-today-sports-media-group/" },
      { label: "videos", url: "https://vip.wordpress.com/2017/03/29/usa-today-sports-media-group-benefits-common-theme/" },
    ],
  },
  {
    year: 2016,
    event: "WordCamp Chicago",
    url: "http://2016.chicago.wordcamp.org/",
    date: "April 30, 2016",
    extras: [],
  },
  {
    year: 2015,
    event: "WordCamp Orlando",
    url: "http://2015.orlando.wordcamp.org/",
    date: "November 15, 2015",
    extras: [],
  },
  {
    year: 2015,
    event: "Barcamp Tampa",
    url: "http://barcamptampabay.org/",
    date: "October 17, 2015",
    extras: [],
  },
  {
    year: 2015,
    event: "WordPress Orlando Meetup",
    url: "http://www.meetup.com/WordPress-Orlando/",
    date: "July 28, 2015",
    extras: [],
  },
  {
    year: 2015,
    event: "WordCamp Boston",
    url: "http://2015.boston.wordcamp.org/",
    date: "July 18, 2015",
    extras: [
      { label: "video", url: "https://youtu.be/sN20_05OsQg" },
    ],
  },
  {
    year: 2015,
    event: "BarCamp Orlando",
    url: "http://barcamporlando.org/",
    date: "April 18, 2015",
    extras: [],
  },
  {
    year: 2014,
    event: "WordCamp Orlando",
    url: "http://2014.orlando.wordcamp.org/",
    date: "December 5, 2014",
    extras: [
      { label: "video", url: "https://wordpress.tv/2015/03/08/panel-discussion-build-and-grow-a-small-team/" },
    ],
  },
  {
    year: 2014,
    event: "Barcamp Tampa",
    url: "http://barcamptampabay.org/",
    date: "October 18, 2014",
    extras: [],
  },
  {
    year: 2014,
    event: "WordCamp Tampa",
    url: "http://2014.tampa.wordcamp.org/",
    date: "October 4, 2014",
    extras: [],
  },
  {
    year: 2014,
    event: "BarCamp Orlando",
    url: "http://barcamporlando.org/",
    date: "September 27, 2014",
    extras: [],
  },
  {
    year: 2014,
    event: "WordCamp Salt Lake City",
    url: "http://2014.slc.wordcamp.org/",
    date: "September 13, 2014",
    extras: [],
  },
  {
    year: 2014,
    event: "WordCamp Miami",
    url: "http://2014.miami.wordcamp.org/",
    date: "May 11, 2014",
    extras: [],
  },
  {
    year: 2013,
    event: "WordCamp Orlando",
    url: "http://2013.orlando.wordcamp.org/",
    date: "November 16, 2013",
    extras: [],
  },
  {
    year: 2013,
    event: "WordPress Orlando Meetup",
    url: "http://www.meetup.com/WordPress-Orlando/",
    date: "August 17, 2013",
    extras: [],
  },
  {
    year: 2013,
    event: "BarCamp Orlando",
    url: "http://barcamporlando.org/",
    date: "May 18, 2013",
    extras: [],
  },
  {
    year: 2013,
    event: "WordCamp Miami",
    url: "http://2013.miami.wordcamp.org/",
    date: "April 6, 2013",
    extras: [
      { label: "video", url: "https://youtu.be/I-57qUgK0CM" },
    ],
  },
  {
    year: 2013,
    event: "WordCamp Miami Beginner Workshop",
    url: "http://2013.miami.wordcamp.org/",
    date: "March 23, 2013",
    extras: [],
  },
  {
    year: 2013,
    event: "WordPress Orlando Meetup",
    url: "http://www.meetup.com/WordPress-Orlando/",
    date: "March 2, 2013",
    extras: [],
  },
  {
    year: 2012,
    event: "WordCamp Orlando",
    url: "http://2012.orlando.wordcamp.org/",
    date: "December 1, 2012",
    extras: [],
  },
  {
    year: 2012,
    event: "Barcamp Tampa",
    url: "http://barcamptampabay.org/",
    date: "October 13, 2012",
    extras: [],
  },
  {
    year: 2012,
    event: "WordPress Orlando Meetup",
    url: "http://www.meetup.com/WordPress-Orlando/",
    date: "October 6, 2012",
    extras: [],
  },
];

export function talksByYear(): { year: number; talks: Talk[] }[] {
  const years = [...new Set(talks.map((t) => t.year))].sort((a, b) => b - a);
  return years.map((year) => ({
    year,
    talks: talks.filter((t) => t.year === year),
  }));
}
