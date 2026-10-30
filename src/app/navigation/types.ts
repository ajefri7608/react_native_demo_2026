import type { NavigatorScreenParams } from '@react-navigation/native';

export type FeedStackParamList = {
  FeedHome: undefined;
  NoteDetail: { noteId: string };
};

export type RootTabParamList = {
  FeedTab: NavigatorScreenParams<FeedStackParamList>;
  WriteTab: undefined;
  ReadTab: undefined;
};
