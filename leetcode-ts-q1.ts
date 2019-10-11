

    type obj1 = {
        x: string;
        y: number;
    };
    type obj1key = obj1[keyof obj1];

    type FuncName<T>  = {
        [P in keyof T]: T[P] extends Function ? P : never;
      }[keyof T];

      type f1 = FuncName<{
          x: string;
          fn1: () => void;
      }>
    const arr1 =['x','y'] as const;

    type d = (typeof arr1)[number];
    type d2 = ['ss' | 'f'];




    interface Action<T> {
        payload?: T;
        type: string;
      }
      
      // const delay: <T extends any, U extends any>(input: Promise<T>) => Promise<Action<U>> = (input: Promise<number>) => {
      //   return input.then(i => ({
      //         payload: `hello ${i}!`,
      //         type: 'delay'
      //     })
      //   );
      // }
      class EffectModule {
        count = 1;
        message = "hello!";
      
        delay(input: Promise<number>) {
          return input.then(i => ({
                payload: `hello ${i}!`,
                type: 'delay'
            })
          );
        }
      
        setMessage(action: Action<Date>) {
          return {
            payload: action.payload!.getMilliseconds(),
            type: "set-message"
          };
        }
      }

type k1 = keyof EffectModule;
type d1  =EffectModule['delay'];
type d3 = d1 extends <T = any, U = any>(input: Promise<T>) => Promise<Action<U>> ? boolean : never;

//       asyncMethod<T, U>(input: Promise<T>): Promise<Action<U>>  变成了
// asyncMethod<T, U>(input: T): Action<U> 
// syncMethod<T, U>(action: Action<T>): Action<U>  变成了
// syncMethod<T, U>(action: T): Action<U>

  type Connect = (module: EffectModule) => {
      [k in FuncName<EffectModule>]: 
        EffectModule[k] extends (input: Promise<infer T>) => Promise<Action<infer U>> ? (input: T)=> Action<U> :
        EffectModule[k] extends (action: Action<infer T>) => Action<infer U> ? (action: T) => Action<U> : never
  }
  //[FuncName<EffectModule>]

  const connect: Connect = (m) => {
    let result: any = {};
    for (let k in m) {
      if (typeof m[k] === 'function') {
        result[k] = m[k];
      }
    }
    return result;
  }

  let eff = new EffectModule();
  let result = connect(eff);
  let r2 = result.delay(123);