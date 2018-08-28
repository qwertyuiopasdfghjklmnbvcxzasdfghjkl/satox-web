const otcHopscotch = {
  id: "otc_welcome_tour",
  onEnd: () => {
    localStorage.setItem('otcHopscotch', 1)
  },
  onClose: () => {
    localStorage.setItem('otcHopscotch', 1)
  },
  steps: [
    {
      target: ".exponent",
      placement: "right",
      title: "This is the navigation menu",
      content: "Use the links here to get around on our site!"
    },
    {
      target: ".pendorder-title",
      placement: "bottom",
      xOffset: "center",
      arrowOffset: "center",
      title: "Your profile picture",
      content: "Upload a profile picture here."
    },
    {
      target: ".pendorder .list",
      placement: "left",
      title: "Your inbox",
      content: "Messages from other users will appear here."
    },
    {
      target: ".order-list",
      placement: "top",
      xOffset: "center",
      arrowOffset: "center",
      title: "Your inbox",
      content: "Messages from other users will appear here."
    }
  ]
}

export default otcHopscotch
