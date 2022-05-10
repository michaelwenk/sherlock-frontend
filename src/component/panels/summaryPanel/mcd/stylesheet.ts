import { Stylesheet } from 'cytoscape';

const styleSheet: Stylesheet[] = [
  {
    selector: 'node',
    css: {
      content: 'data(label)',
      'text-valign': 'center',
      'text-halign': 'center',
      'text-wrap': 'none',
      width: '50px',
      height: '50px',
      color: 'pink',
      'background-color': 'lightgrey',
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': 'black',
    },
  },
  {
    selector: 'edge',
    css: {
      width: 2,
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
    },
  },
  {
    selector: '.bond',
    css: {
      width: 3,
      'line-color': 'black',
      'target-arrow-shape': 'none',
      'curve-style': 'straight',
    },
  },
  {
    selector: '.hmbc',
    css: {
      'line-color': 'red',
    },
  },
  {
    selector: '.cosy',
    css: {
      'line-color': 'blue',
      'target-arrow-shape': 'none',
      'curve-style': 'straight',
    },
  },
  {
    selector: '.C',
    css: {
      color: 'black',
    },
  },
  {
    selector: '.O',
    css: {
      color: 'red',
    },
  },
  {
    selector: '.N',
    css: {
      color: 'blue',
    },
  },
  {
    selector: '.Cl',
    css: {
      color: 'green',
    },
  },
  {
    selector: '.Fl',
    css: {
      color: 'green',
    },
  },
  {
    selector: '.S',
    css: {
      color: 'yellow',
    },
  },
  {
    selector: '.P',
    css: {
      color: 'orange',
    },
  },
  {
    selector: '.Br',
    css: {
      color: 'darkred',
    },
  },
  {
    selector: '.I',
    css: {
      color: 'violet',
    },
  },
  {
    selector: '.highlighted',
    css: {
      color: 'red',
      'font-weight': 'bold',
      'font-size': '20px',
      'background-color': 'cyan',
      'line-color': 'black',
      'line-style': 'dashed',
    },
  },
];

export default styleSheet;
