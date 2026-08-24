// cunningham.ts
export default {
  themes: {
    default: {
      components: {
        "forms-input": {
          "placeholder-color": "#6A788A",
        },
        "forms-labelledbox": {
          "label-color--small": "#6A788A",
        },
        "forms-checkbox": {
          "border-radius": "6px",
        },
      },
      contextuals: {
        background: {
          palette: {
            purple: {
              primary: "#7B06E5",
            },
            pink: {
              primary: "#B00358",
            },
            blue: {
              primary: "#38569F",
            },
            orange: {
              primary: "#9C3902",
            },
            red: {
              primary: "#B50801",
            },
          },
        },
      },
    },

    dark: {
      components: {
        "forms-input": {
          "placeholder-color": "#B5B9BE",
        },
        "forms-labelledbox": {
          "label-color--small": "#B5B9BE",
        },
      },
      contextuals: {
        background: {
          semantic: {
            brand: {
              primary: "#BA01DA",
            },
          },
        },
      },
    },
  },
};
