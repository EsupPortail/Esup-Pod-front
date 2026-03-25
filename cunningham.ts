// cunningham.ts

export default {
  themes: {
    default: {
      components: {
        "forms-input": {
          "placeholder-color": "#6A788A",
        },
        "forms-labelledbox": {
          'label-color--small': "#6A788A",
        }
      }
    },
    dark: {
      components: {
        "forms-input": {
          "placeholder-color": "#B5B9BE",
        },
        "forms-labelledbox": {
          'label-color--small': "#B5B9BE",
        }
      },
      contextuals: {
        background: {
          semantic: {
            brand: {
              primary: "#BA01DA"
            }
          }
        }
      },
    },
  },
};
