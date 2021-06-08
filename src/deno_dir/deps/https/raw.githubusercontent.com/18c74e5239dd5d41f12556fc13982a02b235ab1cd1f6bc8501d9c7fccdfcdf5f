/**
 * An interface that represents a result from an index search.
 *
 * id
 *     The index of the item in the lookup table.
 * item
 *     The item that matches the id in the lookup table.
 * search_input
 *     The input specified that returned this result.
 * search_term
 *     The term associated with the id in the index. This is the item that gets
 *     matched to the search input.
 */
export interface ISearchResult {
  id: number;
  item: unknown;
  search_input: string;
  search_term: string;
}

export class IndexService {
  /**
   * The index -- where the key is the search term and the value is the index to
   * an item in the lookup table.
   */
  protected index: Map<string, number[]> = new Map<string, number[]>();

  /**
   * The lookup table that's used when an index is found in the index.
   */
  protected lookup_table: Map<number, unknown>;

  /**
   * Search terms get cached for faster subsequent lookups. They are stored in a
   * Map and associated with their search result(s).
   */
  protected cache: Map<string, Map<number, ISearchResult>> = new Map<
    string,
    Map<number, ISearchResult>
  >();

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - CONSTRUCTOR /////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  constructor(
    lookupTable: Map<number, unknown>,
  ) {
    this.lookup_table = lookupTable;
  }

  //////////////////////////////////////////////////////////////////////////////
  // FILE MARKER - METHODS - PUBLIC ////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  /**
   * Add an item to the index.
   *
   * @param searchTerm - The term to search for in order to find the item.
   * @param item - The item to add to the index.
   */
  public addItem(searchTerms: string[], item: unknown): void {
    // Make sure the IDs increment when storing items to the lookup table
    const id = this.lookup_table.size;

    // Add the item to the lookup table
    this.lookup_table.set(id, item);

    // Add all search terms and associate them with the item in the index
    searchTerms.forEach((searchTerm: string) => {
      let ids = this.index.get(searchTerm) || [];
      ids.push(id);
      this.index.set(searchTerm, ids);
    });
  }

  /**
   * Get the index.
   *
   * @returns The index.
   */
  public getIndex(): Map<string, number[]> {
    return this.index;
  }

  /**
   * Get the lookup table.
   *
   * @returns The lookup table.
   */
  public getLookupTable(): Map<number, unknown> {
    return this.lookup_table;
  }

  /**
   * Get an item in the index given a search input.
   *
   * @param searchInput- The term to search for.
   *
   * @returns An array of index items that the search input matched.
   */
  public search(searchInput: string): Map<number, ISearchResult> {
    if (this.cache.has(searchInput)) {
      return this.cache.get(searchInput) as Map<number, ISearchResult>;
    }
    const results = new Map<number, ISearchResult>();
    this.index.forEach((ids: number[], key: string) => {
      if (key.includes(searchInput)) {
        ids.forEach((id: number) => {
          results.set(id, {
            id: id,
            item: this.lookup_table.get(id),
            search_term: key,
            search_input: searchInput,
          });
        });
      }
    });

    this.cache.set(searchInput, results);

    return results;
  }
}
