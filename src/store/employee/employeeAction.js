import HttpRequest from "@/util/HttpRequest";
import { dedupeRequest } from "@/util/requestCache";

export default {
  // eslint-disable-next-line no-empty-pattern
  async LOAD_EMPLOYEE_LIST ({}, params) {
    if (!params.projectId) return

    const option = {
      params: {
        page: params.page,
        perPage: params.perPage,
        order_by: params.order_by,
        order_direction: params.order_direction,
        company_id: params.company_id,
        com_name: params.com_name,
        field_ids: params.field_ids,
        employee_id: params.employee_id,
        job_category: params.job_category,
        employment_type: params.employment_type,
        job_title: params.job_title,
        from_hire_date: params.from_hire_date,
        to_hire_date: params.to_hire_date,
        from_current_position_date: params.from_current_position_date,
        to_current_position_date: params.to_current_position_date,
        from_retirement_date: params.from_retirement_date,
        to_retirement_date: params.to_retirement_date,
        contact_number: params.contact_number,
        keyword: params.keyword,
        comType: params.comType,
        fieldId: params.fieldId
      }
    }

    return new Promise((resolve, reject) => {
      HttpRequest.get(`/api/v1/employee/${params.projectId}`, option)
        .then(response => {
          resolve(response)
        }).catch(err => reject(err))
    })
  },
}
