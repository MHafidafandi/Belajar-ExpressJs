const fs = require("fs"); // import module file system

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
const dataPath = "./data/profiles.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadProfiles = () => {
  const fileBuffer = fs.readFileSync("./data/profiles.json", "utf-8");
  const profils = JSON.parse(fileBuffer);
  return profils;
};

const findProfile = (nama) => {
  const profiles = loadProfiles();
  const profile = profiles.find((profile) => profile.nama === nama);
  return profile;
};

const saveProfiles = (profiles) => {
  fs.writeFileSync("data/profiles.json", JSON.stringify(profiles));
};

const addProfile = (profile) => {
  const profiles = loadProfiles();
  profiles.push(profile);
  saveProfiles(profiles);
};

const cekDuplikat = (nama) => {
  const profiles = loadProfiles();
  return profiles.find((profile) => profile.nama === nama);
};

const deleteProfile = (nama) => {
  const profiles = loadProfiles();
  const filteredProfile = profiles.filter((profile) => profile.nama !== nama);
  saveProfiles(filteredProfile);
};

const updateProfile = (profileBaru) => {
  const profiles = loadProfiles();
  const filteredProfile = profiles.filter(
    (profile) => profile.nama !== profileBaru.oldNama
  );
  delete profileBaru.oldNama;
  filteredProfile.push(profileBaru);
  saveProfiles(filteredProfile);
};

module.exports = {
  loadProfiles,
  findProfile,
  addProfile,
  cekDuplikat,
  deleteProfile,
  updateProfile,
};
