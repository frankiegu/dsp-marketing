import { fetch } from '../../util/api';
import api from './../api-config';

export const syncLocalSource = (data) => fetch(api.hdfs +'/sync/local/source/load',{
  data,
});

export const syncLocalTable = (data) => fetch(api.hdfs +'/sync/local/table/load',{
  data,
});

export const syncLocalRecord = (data) => fetch(api.hdfs +'/sync/local/record/load',{
  data,
});

export const saveSyncLocalSource = (data) => fetch(api.hdfs + '/sync/local/source',{
  data
});

export const saveSyncLocalTable = (data) => fetch(api.hdfs + '/sync/local/table',{
  data
});

export const saveSyncLocalRecord = (data) => fetch(api.hdfs + '/sync/local/record',{
  data
});

export const deleteSyncLocalSource = (id) => fetch(api.hdfs + '/sync/local/source/'+ id,{
  'type':'delete'
});

export const deleteSyncLocalTable = (id) => fetch(api.hdfs + '/sync/local/table/'+ id,{
  'type':'delete'
});


