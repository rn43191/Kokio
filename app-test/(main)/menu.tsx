import { StyleSheet, View, Text, Pressable, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAlchemyAuthSession } from "@/context/AlchemyAuthSessionProvider";

const windowHeight = Dimensions.get("window").height;

enum MenuItemType {
	DESTRUCTIVE = "destructive",
	DEFAULT = "default",
}
interface MenuItemsArgs {
	actions: {
		signOut: () => void;
	};
}
const menuItems = ({ actions }: MenuItemsArgs) => {
	return [
		{
			label: "Sign Out",
			Icon: ({ color }: { color?: string }) => (
				<MaterialIcons
					size={20}
					name="exit-to-app"
					color={color || "red"}
				/>
			),
			action: () => actions.signOut(),
			style: MenuItemType.DESTRUCTIVE,
		},
	];
};

export default function AppMenu() {
	const { signOutUser } = useAlchemyAuthSession();
	const router = useRouter();

	return (
		<View style={styles.menuContainer}>
			<Text style={styles.titleText}>{`Menu`}</Text>
			{/* Menu Items */}
			<View>
				{menuItems({
					actions: {
						signOut: async () => {
							await signOutUser();

							return router.replace("/sign-in");
						},
					},
				}).map((item) => (
					<MenuItem key={item.label} {...item} />
				))}
			</View>
		</View>
	);
}

interface MenuItepProps {
	label: string;
	Icon: ({ color }: { color?: string }) => React.JSX.Element;
	action: () => void;
	style?: MenuItemType;
}

const MenuItem = ({
	label,
	Icon,
	action,
	style = MenuItemType.DEFAULT,
}: MenuItepProps) => {
	return (
		<Pressable onPress={action}>
			{({ pressed }) => (
				<View
					key={"label"}
					style={[
						{ opacity: pressed ? 0.5 : 1 },
						styles.menuItemWrapper,
					]}
				>
					<Text
						style={[
							styles.menuItemLabel,
							{
								color:
									style === "destructive" ? "red" : "black",
							},
						]}
					>
						{label}
					</Text>
					<Icon color={style === "destructive" ? "red" : "black"} />
				</View>
			)}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	menuContainer: {
		backgroundColor: "white",
		flex: 1,
		height: windowHeight,
		paddingHorizontal: 20,
		paddingVertical: 30,
	},

	titleText: {
		fontFamily: "SpaceMono",
		fontSize: 25,
	},
	menuItemWrapper: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 15,
	},
	menuItemLabel: {
		fontSize: 18,
		marginRight: 5,
	},
});
