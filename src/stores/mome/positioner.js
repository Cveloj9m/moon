import _ from 'lodash'

/**
 * Various position related things regarding our notes
 * For example, finding a good position for a new note, given the current app
 * "state".
 *
 * Or, sorting notes by the # of votes
 */

class Positioner {
  constructor () {
    return
  }

  // just the "notes" object
  setState (state) {
    this.notes = state
  }

  getPositionforNew (terciary) {
    var appWidth = window.innerWidth
    var typePosition = ((appWidth / 3) * terciary)

    var x = Math.floor((Math.random() * 20) - 10) + typePosition
    var y = Math.floor((Math.random() * 20) - 10)

    return {x, y}
  }

  /**
   * 确保所有的笔记看起来都一样
   * 为了简化把它们对齐到想象的网格上
   */
  normalizeDimensions (note) {
    let size = note.noteSize
    size.w = 150
    size.h = 150
    return note
  }

  /**
   * 函数，返回一个能够定位的函数  
   * 根据它的类型，在想象的网格上标注。 (pos, impr, neut)
   */
  alignToGrid (grid, terciary) {
    const column = grid.columns.indexOf(terciary)

    return function (note, index) {
      let position = note.position
      let size = note.noteSize
      
      // 根据当前的窗口宽度，计算出每个类别适合多少注释  
      const rowWidth = Math.floor((window.innerWidth / grid.columns.length) / size.w) // 3 指出每一行

      const columnWidth = (1 / grid.columns.length) * window.innerWidth
      const columnOffset = column * columnWidth

      position.x = ((index % rowWidth) * size.w) + columnOffset
      position.y = Math.floor(index / rowWidth) * size.h

      return note
    }
  }

  /**
   * 获取应用程序状态的“注释”部分，并执行以下操作  
   * actions:
   * - Filters by type
   * - Orders notes by # of votes
   * - Normalizes the size of each notee
   * - And finally aligns them on a grid
   *
   * 因为这些操作会就地修改对象，所以引用是自动的  
   * 更新。 如果以后有问题的话，我们可以改一下。  
   */
  reArrange () {
    let notes = this.notes;
    ['positive', 'improvement', 'neutral'].forEach((terciary) => {
      _.chain(notes)
      .filter({note_type: terciary})
      .orderBy(['votes'], ['desc'])
      .map(this.normalizeDimensions)
      .map(this.alignToGrid(this.grid, terciary))
      .value();
    })
    return
  }

  /**
   * 根据黑板上的注释创建一个(列)网格  
   */
  setGrid (notes) {
    let grid = {
      columns: []
    };
    ['positive', 'neutral', 'improvement'].forEach(type => {
      const filteredNotes = _.filter(notes, {note_type: type})
      if (filteredNotes.length > 0) {
        grid.columns.push(type)
      }
    })
    this.grid = grid
  }
}
const positioner = new Positioner();

export default positioner;
