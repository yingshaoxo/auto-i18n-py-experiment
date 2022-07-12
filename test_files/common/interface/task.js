import $Request from "@/api/requset";

// 獲取任務中心信息
export function GET_TASKCENTRE(data = {}, config = {}) {
  return $Request({
    url: "/addons/taskcenter/taskcenter/getTaskList",
    data,
    ...config
  });
}

// 領取任務
export function RECEIVE_TASK(data = {}, config = {}) {
  return $Request({
    url: "/addons/taskcenter/taskcenter/getMyTask",
    data,
    ...config
  });
}

// 我的任務
export function GET_TASKLIST(data = {}, config = {}) {
  return $Request({
    url: "/addons/taskcenter/taskcenter/getMyTaskList",
    data,
    ...config
  });
}

// 任務詳情
export function GET_TASKDETAIL(data = {}, config = {}) {
  return $Request({
    url: "/addons/taskcenter/taskcenter/getTaskDetail",
    data,
    ...config
  });
}

// report position
export function report_position(data = {}, config = {}) {
  return $Request({
    url: "/member/checkStatus",
    data,
    ...config
  });
}