import _ from "lodash";
import R from "ramda";
import Person from "./Person";
import Address from "./Address";
import Node from "./Node";
import Tree from "./Tree";

const p1 = new Person("Haskell", "Curry", "111-11-1111");
p1.address = new Address("US");
p1.birthYear = 1900;

const p2 = new Person("Barkley", "Rosser", "222-22-2222");
p2.address = new Address("Greece");
p2.birthYear = 1907;

const p3 = new Person("John", "von Neumann", "333-33-3333");
p3.address = new Address("Hungary");
p3.birthYear = 1903;

const p4 = new Person("Alonzo", "Church", "444-44-4444");
p4.address = new Address("US");
p4.birthYear = 1903;

// _.map: 데이터를 변환
const result = [];
const persons = [p1, p2, p3, p4];

for (let i = 0; i < persons.length; i++) {
  const p = persons[i];
  if (p != null) {
    result.push(p.fullname);
  }
}
// console.log(result);

const result2 = _.map(persons, s => (s != null ? s.fullname : ""));
// console.log(result2);

// 루프를 쓰거나 괴팍한 스코프 문제를 신경 쓸 필요 없이 컬렉션의 원소를 전부 파싱할 경우 아주 유용하다.
// 항상 새로운 배열을 반환하므로 불변성도 간직된다.
// 배열 원소에 각각 이터레이터 함수(f)를 실행한 결괏값을 동일한 크기의 배열에 담아 반환한다.

function map(arr, fn) {
  const len = arr.length,
    result = new Array(len);
  for (let idx = 0; idx < len; ++idx) {
    result[idx] = fn(arr[idx], idx, arr);
  }
  return result;
}
// console.log(map(persons, s => (s != null ? s.fullname : "")));

const result3 = _(persons)
  .reverse()
  .map(p => (p != null ? p.fullname : ""));
// console.log(result3.value());

// reduce
function reduce(arr, fn, accumulator) {
  let idx = -1,
    len = arr.length;
  if (!accumulator && len > 0) {
    accumulator = arr[++idx];
  }
  while (++idx < len) {
    accumulator = fn(accumulator, arr[(idx, idx, arr)]);
  }
  return accumulator;
}

const result4 = _(persons).reduce((stat, person) => {
  const country = person.address.country;
  stat[country] = _.isUndefined(stat[country]) ? 1 : stat[country] + 1;
  return stat;
}, {});
// console.log(result4);

// map과 reduce를 조합하여 통계치를 산출한다.
const getCountry = person => person.address.country;

const gatherStats = function(stat, criteria) {
  stat[criteria] = _.isUndefined(stat[criteria]) ? 1 : stat[criteria] + 1;
  return stat;
};
const result5 = _(persons)
  .map(getCountry)
  .reduce(gatherStats, {});
// console.log(result5);

// ramda와 함께 사용하기

const countryPath = ["address", "country"];

// R.path
// 주어진 path에 있는 값을 찾는다.
// 'address'가 'country'를 가지면 그 값을 반환한다.

// R.assocPath
// 오브젝트의 얕은 복제를 작성해, 지정된 패스를 작성하기 위해서 필요한 노드를 설정 또는 오버라이드 (override) 해,
// 그 패스의 말미에 특정의 값을 배치합니다.
// 프로토 타입 속성을 새 객체에 복사하고 평평하게 만듭니다(flatten).
// 모든 프리미티브가 아닌 속성은 참조로 복사됩니다.

// R.lens
// 주어진 getter 및 setter 함수에 대한 렌즈(Lens)를 반환합니다.
// getter는 포커스의 값을 가져옵니다. setter는 포커스의 값을 "설정"합니다.
// 설정자는 데이터 구조를 변경해서는 안됩니다.

// R.view
//  * @param { Lens } lens
//  * @param {*} x
//  * @return { *}
// 지정한 렌즈에 의해 결정된, 지정된 데이터 구조의 「뷰」를 돌려줍니다.
// 렌즈의 초점은 데이터 구조의 어느 부분이 보이는지를 결정합니다.

// const xLens = R.lens(R.prop('x'), R.assoc('x'));
const countryLens = R.lens(R.path(countryPath), R.assocPath(countryPath));
const result6 = persons.map(R.view(countryLens)).reduce(gatherStats, {});
// console.log(result6);

// reduceRight
// console.log([1, 3, 4, 5].reduce(_.divide));
// console.log([1, 3, 4, 5].reduceRight(_.divide));

// reduce는 리스크 값을 빠짐없이 방문하기 때문에 다소 비효율적이다.
// _.some을 이용해 효율적인 검증기 만들기
const isNotValid = val => _.isUndefined(val) || _.isNull(val);
const notAllValid = args => _(args).some(isNotValid);

const result7 = notAllValid(["string", 0, null, undefined]);
const result8 = notAllValid(["string", 0, {}, []]);
// console.log(result7, result8);

const isValid = val => !_.isUndefined(val) && !_.isNull(val);
const allValid = args => _(args).every(isValid);

const result9 = allValid(["string", 0, null, undefined]);
const result10 = allValid(["string", 0, {}, []]);
// console.log(result9, result10);

// filter
function filter(arr, predicate) {
  let idx = -1,
    len = arr.length;
  result = [];
  while (++idx < len) {
    let value = arr[idx];
    if (predicate(value, idx, this)) {
      result.push(value);
    }
  }
  return result;
}
// const fullname = R.lens(R.path(["fullname"]), R.assocPath(["fullname"]));
const fullname = p => p.fullname;
const result11 = _(persons)
  .filter(isValid)
  .map(fullname);
// .map(R.view(fullname));
// console.log(result11.value());

const bornIn1903 = person => person.birthYear === 1903;
const result12 = _(persons)
  .filter(bornIn1903)
  .map(fullname)
  .join(" and ");
// .map(R.view(fullname)).join(' and ');
// console.log(result12);

// 선언적 코드와 느긋한 함수 체인
// 기반 자료구조에 영향을 끼치지 않는 방향으로 연산을 바라볼 수 있다.
// 이론적으로 배열, 연결리스트, 이진 트리 등 어떤 자료구조를 쓰더라도 프로그램 자체의 의미가 달라져서는 안된다.
// 함수형 프로그래밍은 자료구조보다 연산에 중점을 둔다.

// 리스트를 읽고 데이터를 정제 후 중복은 제거하고 정렬하는 일련의 작업 해보기.
const NAMES = [
  "alonzo church",
  "Haskell curry",
  "stephen_kleene",
  "John Von Neumann",
  "stephen_kleene"
];
// 명령형
// 단점: 특정 문제의 해결만을 목표로 한다.
// 추상화 수준이 낮으면 코드를 재사용할 기회는 줄어들고
// 에러 가능성과 코드 복잡성은 증가한다.
let result13 = [];
for (let i = 0; i < NAMES.length; i++) {
  const n = NAMES[i];
  if (n !== undefined && n !== null) {
    let ns = n.replace(/_/, " ").split(" ");
    for (let j = 0; j < ns.length; j++) {
      let p = ns[j];
      p = p.charAt(0).toUpperCase() + p.slice(1);
      ns[j] = p;
    }
    if (result13.indexOf(ns.join(" ")) < 0) {
      result13.push(ns.join(" "));
    }
  }
}
// console.log(result13.sort());

// 함수형
const result14 = _.chain(NAMES)
  .filter(isValid)
  .map(s => s.replace(/_/, " "))
  .uniq()
  .map(_.startCase)
  .sort()
  .value();
console.log(result14);

// 유사 SQL 데이터: 데이터로서의 함수
// lodash 믹스인(mixin)을 통해 핵심 라이브러리에 함수를 추가하여 체이닝하여 사용할 수 있다.
_.mixin({
  select: _.map,
  from: _.chain,
  where: _.filter
  // sortBy: _.sortByOrder // v4에는 있음
});

const result15 = _.from(persons)
  .where(p => p.birthYear > 1900 && p.address.country !== "US")
  .sortBy(["firstname"])
  .select(p => p.firstname)
  .value();
console.log(result15);

// 데이터로서의 함수: 자바스크립트 코드도 SQL처럼 데이터를 함수 형태로 모형화할 수 있다.
// 선언적으로 '어떤' 데이터가 출력되어야 할지 서술할 뿐 그 출력을 '어떻게' 하는지는 논하지 않는다.

// 재귀적 사고방식
// 순차적 함수 체인만으로 해결하기 어렵고 비효율 적인 자기 반복적인 문제를 반복 자체를 재귀로 추상화하여 해결한다.
// 일반 루프로 수행하기 버거운 작업을 언어 자체의 런타임에 맡김으로써 독자적인 방식으로 데이터를 처리한다.

// 재귀는 주어진 문제를 자기 반복적인 문제들로 잘게 분해하고
// 이들을 다시 조합해 원래 문제의 정답을 찾는 기법이다.

// 기저 케이스(종료 조건)
// 재귀 케이스

// 배열의 원소를 모두 더해보자
const nums = [1, 2, 3, 4, 5];

// 1. for loop
let acc = 0;
for (let i = 0; i < nums.length; i++) {
  acc += nums[i];
}
// console.log(acc);

// 2. _reduce
// console.log(_(nums).reduce((acc, current) => acc + current, 0));

// 3. 재귀적 풀이
// 내부적으로 재귀 호출 스택이 겹겹이 쌓인다.
// 알고리즘이 종료 조건에 이르면 쌓인 스택이 런타임에 의해 즉시 풀리면서
// 반환문이 모두 실행되고 이 과정에서 실제 덧셈이 이루어진다.
const sum = arr => {
  if (_.isEmpty(arr)) {
    return 0;
  }
  return _.head(arr) + sum(_.tail(arr));
};
// console.log(sum([]));
// console.log(sum(nums));

// 꼬리 위치에서 재귀 호출하기
const sumTail = (arr, acc = 0) => {
  console.log(arr, acc);
  if (_.isEmpty(arr)) {
    return acc;
  }
  return sumTail(_.tail(arr), acc + _.head(arr));
};

// console.log(sumTail(nums));

// 자바스크립트는 언어 자체로 내장 트리 객체를 지원하지 않으므로
// 노드 기반의 단순한 자료구조를 만들어야 한다.

// 노드: 값을 지닌 객체로 자신의 부모와 자식 배열을 레퍼런스로 참조한다.
// 재귀적으로 정의한 자료 구조
const church = new Node(new Person("Alonzo", "Church", "111-11-1111"));
const rosser = new Node(new Person("Barkley", "Rosser", "222-22-2222"));
const turing = new Node(new Person("Alan", "Turing", "333-33-3333"));
const kleene = new Node(new Person("Stephen", "Kleene", "444-44-4444"));
