export default interface Grouping {
  tolerances: { [atomType: string]: number };
  groups: { [atomType: string]: { [groupIndex: number]: number[] } };
  transformedGroups: { [atomType: string]: { [atomIndex: number]: number } };
}
