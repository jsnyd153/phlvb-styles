export interface Event {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  level:string;
  eventType:string;
  gender:string;
  status:string;
  host:string;
  location:Location;
  day:string;
}

interface Location {
 title:string;
 neighborhood:string;
}



