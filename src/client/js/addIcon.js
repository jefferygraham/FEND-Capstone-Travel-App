function addIcon(icon) {
    const skycons = new Skycons({ "color": "#586f7c" });
    skycons.add("icon1", icon);
    skycons.play();
}

export { addIcon }