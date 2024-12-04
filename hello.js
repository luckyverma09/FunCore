!(function () {
  var t = !1,
    e = {
      board: [],
      boardDiv: null,
      canvas: null,
      pSize: 20,
      canvasHeight: 440,
      canvasWidth: 200,
      boardHeight: 0,
      boardWidth: 0,
      spawnX: 4,
      spawnY: 1,
      shapes: [
        [
          [-1, 1],
          [0, 1],
          [1, 1],
          [0, 0],
        ],
        [
          [-1, 0],
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        [
          [-1, -1],
          [-1, 0],
          [0, 0],
          [1, 0],
        ],
        [
          [1, -1],
          [-1, 0],
          [0, 0],
          [1, 0],
        ],
        [
          [0, -1],
          [1, -1],
          [-1, 0],
          [0, 0],
        ],
        [
          [-1, -1],
          [0, -1],
          [0, 0],
          [1, 0],
        ],
        [
          [0, -1],
          [1, -1],
          [0, 0],
          [1, 0],
        ],
      ],
      tempShapes: null,
      curShape: null,
      curShapeIndex: null,
      curX: 0,
      curY: 0,
      curSqs: [],
      nextShape: null,
      nextShapeDisplay: null,
      nextShapeIndex: null,
      sqs: [],
      score: 0,
      scoreDisplay: null,
      level: 1,
      levelDisplay: null,
      numLevels: 10,
      time: 0,
      maxTime: 1e3,
      timeDisplay: null,
      isActive: 0,
      curComplete: !1,
      timer: null,
      sTimer: null,
      speed: 700,
      lines: 0,
      init: function () {
        (t = !0),
          (this.canvas = document.getElementById('canvas')),
          this.initBoard(),
          this.initInfo(),
          this.initLevelScores(),
          this.initShapes(),
          this.bindKeyEvents(),
          this.play();
      },
      initBoard: function () {
        (this.boardHeight = this.canvasHeight / this.pSize),
          (this.boardWidth = this.canvasWidth / this.pSize);
        for (var t = this.boardHeight * this.boardWidth, e = 0; e < t; e++) this.board.push(0);
      },
      initInfo: function () {
        (this.nextShapeDisplay = document.getElementById('next_shape')),
          (this.levelDisplay = document.getElementById('level').getElementsByTagName('span')[0]),
          (this.timeDisplay = document.getElementById('time').getElementsByTagName('span')[0]),
          (this.scoreDisplay = document.getElementById('score').getElementsByTagName('span')[0]),
          (this.linesDisplay = document.getElementById('lines').getElementsByTagName('span')[0]),
          this.setInfo('time'),
          this.setInfo('score'),
          this.setInfo('level'),
          this.setInfo('lines');
      },
      initShapes: function () {
        (this.curSqs = []),
          (this.curComplete = !1),
          this.shiftTempShapes(),
          (this.curShapeIndex = this.tempShapes[0]),
          (this.curShape = this.shapes[this.curShapeIndex]),
          this.initNextShape(),
          this.setCurCoords(this.spawnX, this.spawnY),
          this.drawShape(this.curX, this.curY, this.curShape);
      },
      initNextShape: function () {
        void 0 === this.tempShapes[1] && this.initTempShapes();
        try {
          (this.nextShapeIndex = this.tempShapes[1]),
            (this.nextShape = this.shapes[this.nextShapeIndex]),
            this.drawNextShape();
        } catch (t) {
          throw Error('Could not create next shape. ' + t);
        }
      },
      initTempShapes: function () {
        this.tempShapes = [];
        for (var t = 0; t < this.shapes.length; t++) this.tempShapes.push(t);
        for (var e = this.tempShapes.length; --e; ) {
          var i = Math.floor(Math.random() * (e + 1)),
            s = this.tempShapes[e],
            h = this.tempShapes[i];
          (this.tempShapes[e] = h), (this.tempShapes[i] = s);
        }
      },
      shiftTempShapes: function () {
        try {
          void 0 === this.tempShapes || null === this.tempShapes
            ? this.initTempShapes()
            : this.tempShapes.shift();
        } catch (t) {
          throw Error('Could not shift or init tempShapes: ' + t);
        }
      },
      initTimer: function () {
        var t = this,
          e = function () {
            t.incTime(), (t.timer = setTimeout(e, 2e3));
          };
        this.timer = setTimeout(e, 2e3);
      },
      initLevelScores: function () {
        for (var t = 1, e = 1; e <= this.numLevels; e++)
          (this['level' + e] = [1e3 * t, 40 * e, 5 * e]), (t += t);
      },
      setInfo: function (t) {
        this[t + 'Display'].innerHTML = this[t];
      },
      drawNextShape: function () {
        for (var t = [], e = 0; e < this.nextShape.length; e++)
          t[e] = this.createSquare(
            this.nextShape[e][0] + 2,
            this.nextShape[e][1] + 2,
            this.nextShapeIndex
          );
        this.nextShapeDisplay.innerHTML = '';
        for (var i = 0; i < t.length; i++) this.nextShapeDisplay.appendChild(t[i]);
      },
      drawShape: function (t, e, i) {
        for (var s = 0; s < i.length; s++) {
          var h = i[s][0] + t,
            n = i[s][1] + e;
          this.curSqs[s] = this.createSquare(h, n, this.curShapeIndex);
        }
        for (var a = 0; a < this.curSqs.length; a++) this.canvas.appendChild(this.curSqs[a]);
      },
      createSquare: function (t, e, i) {
        var s = document.createElement('div');
        return (
          (s.className = 'square type' + i),
          (s.style.left = t * this.pSize + 'px'),
          (s.style.top = e * this.pSize + 'px'),
          s
        );
      },
      removeCur: function () {
        var t = this;
        this.curSqs.eachdo(function () {
          t.canvas.removeChild(this);
        }),
          (this.curSqs = []);
      },
      setCurCoords: function (t, e) {
        (this.curX = t), (this.curY = e);
      },
      bindKeyEvents: function () {
        var t = this,
          e = 'keypress';
        (this.isSafari() || this.isIE()) && (e = 'keydown');
        var i = function (e) {
          t.handleKey(e);
        };
        window.addEventListener
          ? document.addEventListener(e, i, !1)
          : document.attachEvent('on' + e, i);
      },
      handleKey: function (t) {
        var e = this.whichKey(t);
        switch (e) {
          case 37:
            this.move('L');
            break;
          case 38:
            this.move('RT');
            break;
          case 39:
            this.move('R');
            break;
          case 40:
            this.move('D');
            break;
          case 27:
            this.togglePause();
        }
      },
      whichKey: function (t) {
        var e;
        return window.event ? (e = window.event.keyCode) : t && (e = t.keyCode), e;
      },
      incTime: function () {
        this.time++, this.setInfo('time');
      },
      incScore: function (t) {
        (this.score = this.score + t), this.setInfo('score');
      },
      incLevel: function () {
        this.level++, (this.speed = this.speed - 75), this.setInfo('level');
      },
      incLines: function (t) {
        (this.lines += t), this.setInfo('lines');
      },
      calcScore: function (t) {
        var e = t.lines || 0,
          i = t.shape || !1;
        t.speed;
        var s = 0;
        e > 0 && ((s += e * this['level' + this.level][1]), this.incLines(e)),
          !0 === i && (s += i * this['level' + this.level][2]),
          this.incScore(s);
      },
      checkScore: function () {
        this.score >= this['level' + this.level][0] && this.incLevel();
      },
      gameOver: function () {
        this.clearTimers(), (t = !1), (this.canvas.innerHTML = '<h1>GAME OVER</h1>');
      },
      play: function () {
        var t = this;
        null === this.timer && this.initTimer();
        var e = function () {
          t.move('D'),
            t.curComplete
              ? (t.markBoardShape(t.curX, t.curY, t.curShape),
                t.curSqs.eachdo(function () {
                  t.sqs.push(this);
                }),
                t.calcScore({ shape: !0 }),
                t.checkRows(),
                t.checkScore(),
                t.initShapes(),
                t.play())
              : (t.pTimer = setTimeout(e, t.speed));
        };
        (this.pTimer = setTimeout(e, t.speed)), (this.isActive = 1);
      },
      togglePause: function () {
        1 === this.isActive ? (this.clearTimers(), (this.isActive = 0)) : this.play();
      },
      clearTimers: function () {
        clearTimeout(this.timer),
          clearTimeout(this.pTimer),
          (this.timer = null),
          (this.pTimer = null);
      },
      move: function (t) {
        var e = '',
          i = this,
          s = this.curX,
          h = this.curY;
        switch (t) {
          case 'L':
            (e = 'left'), (s -= 1);
            break;
          case 'R':
            (e = 'left'), (s += 1);
            break;
          case 'D':
            (e = 'top'), (h += 1);
            break;
          case 'RT':
            return this.rotate(), !0;
          default:
            throw Error('wtf');
        }
        if (this.checkMove(s, h, this.curShape))
          this.curSqs.eachdo(function (s) {
            var h = parseInt(this.style[e], 10);
            'L' === t ? (h -= i.pSize) : (h += i.pSize), (this.style[e] = h + 'px');
          }),
            (this.curX = s),
            (this.curY = h);
        else if ('D' === t) {
          if (1 === this.curY || this.time === this.maxTime) return this.gameOver(), !1;
          this.curComplete = !0;
        }
      },
      rotate: function () {
        if (6 !== this.curShapeIndex) {
          var t = [];
          if (
            (this.curShape.eachdo(function () {
              t.push([-1 * this[1], this[0]]);
            }),
            this.checkMove(this.curX, this.curY, t))
          )
            (this.curShape = t),
              this.removeCur(),
              this.drawShape(this.curX, this.curY, this.curShape);
          else throw Error('Could not rotate!');
        }
      },
      checkMove: function (t, e, i) {
        return !(this.isOB(t, e, i) || this.isCollision(t, e, i));
      },
      isCollision: function (t, e, i) {
        var s = this,
          h = !1;
        return (
          i.eachdo(function () {
            var i = this[0] + t,
              n = this[1] + e;
            1 === s.boardPos(i, n) && (h = !0);
          }),
          h
        );
      },
      isOB: function (t, e, i) {
        var s = this.boardWidth - 1,
          h = this.boardHeight - 1,
          n = !1;
        return (
          i.eachdo(function () {
            var i = this[0] + t,
              a = this[1] + e;
            (i < 0 || i > s || a < 0 || a > h) && (n = !0);
          }),
          n
        );
      },
      getRowState: function (t) {
        for (var e = 0, i = 0; i < this.boardWidth; i++) 1 === this.boardPos(i, t) && (e += 1);
        return 0 === e ? 'E' : e === this.boardWidth ? 'F' : 'U';
      },
      checkRows: function () {
        var t = this,
          e = this.boardHeight;
        this.curShape.eachdo(function () {
          var i = this[1] + t.curY;
          console.log(i), i < e && (e = i);
        }),
          console.log(e);
        for (var i = 0, s = !1, h = this.boardHeight - 1; h >= 0; h--) {
          switch (this.getRowState(h)) {
            case 'F':
              this.removeRow(h), i++;
              break;
            case 'E':
              0 === i && (s = !0);
              break;
            case 'U':
              i > 0 && this.shiftRow(h, i);
          }
          if (!0 === s) break;
        }
        i > 0 && this.calcScore({ lines: i });
      },
      shiftRow: function (t, e) {
        for (var i = this, s = 0; s < this.boardWidth; s++)
          this.sqs.eachdo(function () {
            i.isAt(s, t, this) && i.setBlock(s, t + e, this);
          });
        i.emptyBoardRow(t);
      },
      emptyBoardRow: function (t) {
        for (var e = 0; e < this.boardWidth; e++) this.markBoardAt(e, t, 0);
      },
      removeRow: function (t) {
        for (var e = 0; e < this.boardWidth; e++) this.removeBlock(e, t);
      },
      removeBlock: function (t, e) {
        var i = this;
        this.markBoardAt(t, e, 0),
          this.sqs.eachdo(function (s) {
            i.getPos(this)[0] === t &&
              i.getPos(this)[1] === e &&
              (i.canvas.removeChild(this), i.sqs.splice(s, 1));
          });
      },
      setBlock: function (t, e, i) {
        this.markBoardAt(t, e, 1);
        var s = t * this.pSize,
          h = e * this.pSize;
        (i.style.left = s + 'px'), (i.style.top = h + 'px');
      },
      isAt: function (t, e, i) {
        return this.getPos(i)[0] === t && this.getPos(i)[1] === e;
      },
      getPos: function (t) {
        var e = [];
        return (
          e.push(parseInt(t.style.left, 10) / this.pSize),
          e.push(parseInt(t.style.top, 10) / this.pSize),
          e
        );
      },
      getBoardIdx: function (t, e) {
        return t + e * this.boardWidth;
      },
      boardPos: function (t, e) {
        return this.board[t + e * this.boardWidth];
      },
      markBoardAt: function (t, e, i) {
        this.board[this.getBoardIdx(t, e)] = i;
      },
      markBoardShape: function (t, e, i) {
        var s = this;
        i.eachdo(function (h) {
          var n = i[h][0] + t,
            a = i[h][1] + e;
          s.markBoardAt(n, a, 1);
        });
      },
      isIE: function () {
        return this.bTest(/IE/);
      },
      isFirefox: function () {
        return this.bTest(/Firefox/);
      },
      isSafari: function () {
        return this.bTest(/Safari/);
      },
      bTest: function (t) {
        return t.test(navigator.userAgent);
      },
    };
  let i = document.querySelector('#start');
  i.addEventListener('click', function () {
    (i.style.display = 'none'), t || e.init();
  });
})(),
  Array.prototype.eachdo ||
    (Array.prototype.eachdo = function (t) {
      for (var e = 0; e < this.length; e++) t.call(this[e], e);
    }),
  Array.prototype.remDup ||
    (Array.prototype.remDup = function () {
      for (var t = [], e = 0; e < this.length; e++) {
        for (var i = !0, s = e + 1; s < this.length; s++) this[e] === this[s] && (i = !1);
        !0 === i && t.push(this[e]);
      }
      return t;
    });
