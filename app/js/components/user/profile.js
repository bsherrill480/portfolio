function ProfileCtrl() {
}

function profileCmpnt() {
    return {
        templateUrl: 'components/user/profile.html',
        controller: ProfileCtrl
    }
}


export default {
    name: 'profile',
    fn: profileCmpnt
};
