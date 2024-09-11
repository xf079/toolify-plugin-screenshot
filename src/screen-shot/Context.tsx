import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useReducer
} from 'react';

type IShotContext = {
  mode?: 'shot' | 'shape';
  shot?: IShotRect;
  action?: ISelectToolOptionType;
};

type IAction = {
  type: string;
  payload: any;
};

const initialState: IShotContext = {
  mode: undefined,
  shot: undefined,
  action: undefined
};

const ShotContext = createContext<{
  state: IShotContext;
  dispatch: Dispatch<any>;
}>({
  state: initialState,
  dispatch: () => null
});

const reducers = (state: IShotContext, action: IAction) => {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload };
    case 'SET_SHOT':
      return { ...state, shot: action.payload };
    case 'UPDATE_ACTION':
      return { ...state, action: action.payload };
  }
  return state;
};

const ShotProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducers, initialState);
  return (
    <ShotContext.Provider value={{ state, dispatch }}>
      {children}
    </ShotContext.Provider>
  );
};

export { ShotContext, ShotProvider };
