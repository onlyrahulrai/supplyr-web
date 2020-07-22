formSchema={
fields:[
            {
              type: "text",
              label: "Business Name",
              name: "entity_name",
              required: true,
              
            },

            {
              type: "select",
              name: "entity_type",
              required: true,
              label: "Select your entity type",
              horizontal: true,
              horizontalColSplitOn: 5,
              required: true,
              options: [
                {
                  label: "Private Limited",
                  value: "pvtltd",
                },
                {
                  label: "Limited Liablity Partnership",
                  value: "llp",
                },
                {
                  label: "Partnership Firm",
                  value: "partnership",
                },
              ],

              dependentFieldsSet: [
                {
                  displayOnValue: "pvtltd",
                  fields: [
                    {
                      type: "file",
                      label: "Certificate of incorporation",
                      name: "incorp_cert",
                      required: true,
                    }
                  ]
                },
                {
                  displayOnValue: "llp",
                  fields: [
                    {
                      type: "text",
                      label: "LLP Number",
                      name: "llp_num",
                      required: true,
                    }
                  ]
                }
              ]
            },


            {
              type: "number",
              value: "",
              label: "PAN Number",
              name: "pan",
              required: true,
            },


            {
              type: "radio",
              name: "is_gst",
              required: true,
              label: "Have you enrolled for GST?",
              horizontal: true,
              options: [
                {
                  label: "Yes",
                  value: "yes",
                  // disabled: true,
                },
                {
                  label: "No",
                  value: "no",
                },
              ],

              dependentFieldsSet: [
                {
                  displayOnValue: "yes",
                  fields: [
                    {
                      type: "text",
                      label: "Enter GST Number",
                      name: "gst_number",
                      required: true,
                    },
                    {
                      type: "text",
                      label: "Enter GST random detail 2?",
                      name: "gst_regid",
                      required: true,
                    },
                  ],
                },
                {
                  displayOnValue: "no",
                  fields: [
                    {
                      type: "radio",
                      name: "var_enroll",
                      required: true,
                      label: "Have you enrolled for VAT?",
                      horizontal: true,
                      horizontalColSplitOn: 5,
                      options: [
                        {
                          label: "Yes",
                          value: "yes",
                        },
                        {
                          label: "No",
                          value: "no",
                        },
                      ],

                      dependentFieldsSet: [
                        {
                          displayOnValue: "yes",
                          fields: [
                            {
                              type: "text",
                              label: "VAT Number",
                              name: "vat_num",
                              required: true,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },

          ]
          }