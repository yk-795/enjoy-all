interface TestProps {
  _id: string,
  name: string
}
const testData: TestProps[] = [{ _id: '1', name: 'a' }, { _id: '2', name: 'b' }]
// 数组转对象
export const arrToObj = <T extends {_id?:string}>(arr:Array<T>) => {
  return arr.reduce((prev, current) => {
    if (current._id) {
      prev[current._id] = current
    }
    return prev
  }, {} as {[key:string]:T})
}
// 对象转数组
export const objToArr = <T>(obj:{[key:string]:T}) => {
  return Object.keys(obj).map(key => obj[key])
}
