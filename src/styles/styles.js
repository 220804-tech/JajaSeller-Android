import { Colors, Hp } from "../export";

export const styles = StyleSheet.create({
    inputbox: {
        width: '100%',
        backgroundColor: 'transparent',
        color: 'black'
    },
    actionSheetBody: {
        flex: 1, justifyContent: 'center', paddingVertical: '3%'
    },
    form: {
        flex: 0,
        flexDirection: 'column',
        paddingVertical: '1%',
        marginBottom: '3%'
    },
    formPlaceholder: {
        fontSize: 14, color: Colors.blackLight, fontFamily: "Poppins-Regular",
    },
    // '#C7C7CD'
    formItem: {
        flex: 0, flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderBottomColor: '#C0C0C0', borderBottomWidth: 0.5, paddingBottom: '2%', paddingTop: '1%'
    },
    formTitle: {
        fontSize: 14, color: 'grey', fontFamily: "Poppins-Regular",
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 95
    },
    body: {
        flex: 1, flexDirection: "column",
    },
    card: { padding: '4%', marginBottom: '2%' },
    imageHeader: {
        height: '30%',
        width: '100%',
        opacity: 1,
    },
    header: {
        height: Hp('20%'),
        flex: 0,
        flexDirection: 'column',
        backgroundColor: Colors.biruJaja,
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity: 0.95,
    },
    ubah: {
        color: Colors.biruJaja,
        fontFamily: "Poppins-SemiBold",
        elevation: 1
    }
});
