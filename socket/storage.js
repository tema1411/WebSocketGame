import { MAXIMUM_USERS_FOR_ONE_ROOM } from './config';

export const rooms = new Map();
export const users = new Map();

export const updateUserInfo = ({ id, newStatusData = {}, isNew = false }) => {
    const defaultData = {
        id,
        isReadyToPlay: false,
        username: '',
        typedPercent: 0,
        isFinished: false,
        score: null,
    };
    const currentStatusData = users.get(id) ?? {};

    let newData;
    if (isNew) {
        newData = { ...defaultData, username: currentStatusData.username };
    } else {
        newData = { ...defaultData, ...currentStatusData, ...newStatusData };
    }

    users.set(id, newData);
};

export const updateRoomsInfo = (id, newStatusData = {}) => {
    const defaultData = {
        id,
        isFinishedGame: false,
        isStarted: false,
        usersCount: 0,
        usersReady: new Set(),
    };

    const currentStatusData = rooms.get(id) ?? {};

    let newData = { ...defaultData, ...currentStatusData, ...newStatusData };

    rooms.set(id, newData);
};

export const checkFreeUsername = (newUserName) => {
    let isFree = true;
    users.forEach(({ username }) => {
        if (username === newUserName) {
            isFree = false;
        }
    });
    return isFree;
};

export const updateRoomCountUsers = (roomId, difference) => {
    const currentUsersCount = rooms.get(roomId)?.usersCount ?? 0;
    updateRoomsInfo(roomId, { usersCount: currentUsersCount + difference });
};

export const getRoomsData = () => {
    const roomsData = [];

    rooms.forEach(({ id: roomId, usersCount, isStarted }) => {
        if (usersCount < MAXIMUM_USERS_FOR_ONE_ROOM && !isStarted) {
            roomsData.push({
                name: roomId,
                usersLength: usersCount,
            });
        }
    });

    return roomsData;
};

export const updateRoomReadyList = (roomId, userId, isAdd = true) => {
    const usersReady = rooms.get(roomId)?.usersReady ?? new Set();

    isAdd ? usersReady.add(userId) : usersReady.delete(userId);
    updateRoomsInfo(roomId, { usersReady });
};
