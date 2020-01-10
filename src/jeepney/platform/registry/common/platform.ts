export interface IRegistry {

    /**
	 * Returns the extension functions and properties defined by the specified key or null.
	 * @param id an extension identifier
	 */
	as<T>(id: string): T;

}

class RegistryImpl implements IRegistry {

    private readonly data = new Map<string, any>();

    public as(id: string): any {
		return this.data.get(id) || null;
	}

}

export const Registry: IRegistry = new RegistryImpl();