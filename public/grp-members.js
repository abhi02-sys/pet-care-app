// async function loadGroupMembers() {
//   const currentUser = JSON.parse(localStorage.getItem("currentUser"));
//   const list = document.getElementById("groupMembersList");

//   if (!currentUser || !currentUser.id) {
//     list.innerHTML = "<li>User not logged in.</li>";
//     return;
//   }

//   try {
//     // Step 1: Fetch group code based on user ID
//     const groupRes = await fetch(`/api/group-code/${currentUser.id}`);
//     if (!groupRes.ok) throw new Error("Failed to fetch group code");
//     const groupData = await groupRes.json();
//     const groupCode = groupData.groupCode;

//     if (!groupCode) {
//       list.innerHTML = "<li>You are not in any group yet.</li>";
//       return;
//     }

//     // Step 2: Fetch members from that group
//     const response = await fetch(`/api/groups/${groupCode}/members`);
//     if (!response.ok) throw new Error("Failed to fetch group members");

//     const data = await response.json();
//     if (!data.success || !Array.isArray(data.members) || data.members.length === 0) {
//       list.innerHTML = "<li>No other members in this group.</li>";
//       return;
//     }

//     list.innerHTML = data.members.map(member => `
//       <li><strong>${member.username}</strong> (${member.email})</li>
//     `).join("");

//   } catch (err) {
//     console.error("Error loading group members:", err);
//     list.innerHTML = "<li>Error loading members.</li>";
//   }
// }

async function loadGroupMembers() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const list = document.getElementById("groupMembersList");

  if (!currentUser || !currentUser.id) {
    list.innerHTML = "<li>User not logged in.</li>";
    return;
  }

  try {
    console.log("🔍 Fetching group code for user:", currentUser.id);
    const groupRes = await fetch(`/api/group-code/${currentUser.id}`);
    const groupData = await groupRes.json();
    console.log("📦 Group data:", groupData);

    const groupCode = groupData.groupCode;

    if (!groupCode) {
      list.innerHTML = "<li>You are not in any group yet.</li>";
      return;
    }

    console.log("🔍 Fetching members of group:", groupCode);
    const response = await fetch(`/api/groups/${groupCode}/members`);
    const data = await response.json();
    console.log("📦 Group members:", data);

    if (!data.success || !Array.isArray(data.members) || data.members.length === 0) {
      list.innerHTML = "<li>No other members in this group.</li>";
      return;
    }

    list.innerHTML = data.members.map(member => `
      <li><strong>${member.username}</strong></li>
    `).join("");

  } catch (err) {
    console.error("❌ Error loading group members:", err);
    list.innerHTML = "<li>Error loading members.</li>";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadGroupMembers();
});

