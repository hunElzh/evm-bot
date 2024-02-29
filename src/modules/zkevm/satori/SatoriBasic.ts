export class SatoriBasic {
  private _IsOverCost: any;
  private _LastTimeTick: any;
  private _TurnBackTimeTick: any;
  private _TurnBackIndex: any;
  private _CurrentSeqNumber: any;
  private _OverCostCountInOneTerm: any;
  private _TimestampShift:any;
  private MinSeqNumber: any;
  private MaxSeqNumber: any;
  private BaseTime: any;
  private WorkerId: any;
  private SeqBitLength: any;
  private WorkerIdBitLength: any;
  private TopOverCostCount: any;

  constructor(e: any){
    if (void 0 === e.workerId)
      throw new Error("lost WorkerId");
    (!e.baseTime || e.baseTime < 0) && (e.baseTime = 15778368e5);
    (!e.workerIdBitLength || e.workerIdBitLength < 0) && (e.workerIdBitLength = 6);
    (!e.seqBitLength || e.seqBitLength < 0) && (e.seqBitLength = 6),
    (null == e.maxSeqNumber || e.maxSeqNumber <= 0) && (e.maxSeqNumber = 63);
    (null == e.minSeqNumber || e.minSeqNumber < 0) && (e.minSeqNumber = 5);
    (null == e.topOverCostCount || e.topOverCostCount < 0) && (e.topOverCostCount = 2e3),
    2 !== e.method ? e.method = 1 : e.method = 2,
    // this.Method = BigInt(e.method),
    this.BaseTime = BigInt(e.baseTime),
    this.WorkerId = BigInt(e.workerId),
    this.WorkerIdBitLength = BigInt(e.workerIdBitLength),
    this.SeqBitLength = BigInt(e.seqBitLength),
    this.MaxSeqNumber = BigInt(e.maxSeqNumber),
    this.MinSeqNumber = BigInt(e.minSeqNumber),
    this.TopOverCostCount = BigInt(e.topOverCostCount);
    const timestampShift = this.WorkerIdBitLength + this.SeqBitLength
      , currentSeqNumber = this.MinSeqNumber;
    this._TimestampShift = timestampShift,
    this._CurrentSeqNumber = currentSeqNumber,
    this._LastTimeTick = BigInt(0),
    this._TurnBackTimeTick = BigInt(0),
    this._TurnBackIndex = 0,
    this._IsOverCost = !1
    this._OverCostCountInOneTerm = 0
  }

  public nextId = () => {
    // if (this._IsOverCost) {
    //     let e = this.NextOverCostId();
    //     return e >= 9007199254740992n ? e : parseInt(e.toString())
    // }
    // {
    //     let e = this.NextNormalId();
    //     return e >= 9007199254740992n ? e : parseInt(e.toString())
    // }

    let e = this.NextNormalId();
    return e >= 9007199254740992n ? e : parseInt(e.toString())
  }


  public NextNormalId = (): any => {
    const e = this.GetCurrentTimeTick();
    return e < this._LastTimeTick ? (this._TurnBackTimeTick < 1 && (this._TurnBackTimeTick = this._LastTimeTick - BigInt(1),
    this._TurnBackIndex++,
    this._TurnBackIndex > 4 && (this._TurnBackIndex = 1),
    this.BeginTurnBackAction(this._TurnBackTimeTick)),
    this.CalcTurnBackId(this._TurnBackTimeTick)) : (this._TurnBackTimeTick > 0 && (this.EndTurnBackAction(this._TurnBackTimeTick),
    this._TurnBackTimeTick = BigInt(0)),
    e > this._LastTimeTick ? (this._LastTimeTick = e,
    this._CurrentSeqNumber = this.MinSeqNumber,
    this.CalcId(this._LastTimeTick)) : this._CurrentSeqNumber > this.MaxSeqNumber ? (this.BeginOverCostAction(e),
    this._LastTimeTick++,
    this._CurrentSeqNumber = this.MinSeqNumber,
    this._IsOverCost = !0,
    this._OverCostCountInOneTerm = 1,
    this.CalcId(this._LastTimeTick)) : this.CalcId(this._LastTimeTick))
  }

  public GetCurrentTimeTick = () => {
    return BigInt((new Date).valueOf()) - this.BaseTime;
  }

  public CalcTurnBackId = (e:any) => {
    const t = BigInt(e << this._TimestampShift) + BigInt(this.WorkerId << this.SeqBitLength) + BigInt(this._TurnBackIndex);
    return this._TurnBackTimeTick--, t
  }

  public CalcId = (e: any) => {
    const t = BigInt(e << this._TimestampShift) + BigInt(this.WorkerId << this.SeqBitLength) + BigInt(this._CurrentSeqNumber);
    return this._CurrentSeqNumber++, t
  }

  public BeginTurnBackAction = (e:any) => {}
  public EndTurnBackAction = (e: any) => {}
  public BeginOverCostAction = (e: any) => {}
}
